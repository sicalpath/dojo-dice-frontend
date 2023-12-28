import { useMemo, useState } from 'react';
import { Client, KeyPairsType, WalletType, BlockChainType, DidType } from '@web3mq/client';
import { useWalletClient, useAccount } from 'wagmi'

const BlockChainMap: Record<WalletType, BlockChainType> = {
    metamask: 'eth',
    braavos: 'starknet',
    argentX: 'starknet',
    dappConnect: 'eth',
};
type MainKeysType = {
    publicKey: string;
    privateKey: string;
    walletAddress: string;
};

type UserAccountType = {
    userid: string;
    address: string;
    walletType: WalletType;
    userExist: boolean;
};

const PASSWORD = "111111";
const APPKEY = 'vAUJTFXbBZRkEDRE';  //OVEEGLRxtqXcEIJN  //vAUJTFXbBZRkEDRE
export function useWeb3MQLogin() {
    const hasKeys = useMemo(() => {
        const PrivateKey = localStorage.getItem('PRIVATE_KEY') || '';
        const PublicKey = localStorage.getItem('PUBLIC_KEY') || '';
        const userid = localStorage.getItem('userid') || '';
        if (PrivateKey && PublicKey && userid) {
            return { PrivateKey, PublicKey, userid };
        }
        return null;
    }, []);
    const { data: walletClient, isError, isLoading } = useWalletClient();
    const { address } = useAccount();

    const [keys, setKeys] = useState<KeyPairsType | null>(hasKeys);
    const [client, setClient] = useState<Client>();
    const [fastestUrl, setFastUrl] = useState<string | null>(null);
    const [userAccount, setUserAccount] = useState<UserAccountType>({
        userid: "",
        address: address as string,
        walletType: 'metamask',
        userExist: false,
    });

    const [mainKeys, setMainKeys] = useState<MainKeysType>();




    const init = async () => {
        const tempPubkey = localStorage.getItem('PUBLIC_KEY') || '';
        const didKey = localStorage.getItem('DID_KEY') || '';
        const fastUrl = await Client.init({
            connectUrl: localStorage.getItem('FAST_URL') || "https://testnet-ap-singapore-1.web3mq.com",
            app_key: APPKEY,
            env: 'dev',
            didKey,
            tempPubkey,
        });
        localStorage.setItem('FAST_URL', fastUrl);
        setFastUrl(fastUrl);
        getUserAccount('metamask', address?.toLowerCase());
        if (keys) {
            const client = Client.getInstance(keys);
            setClient(client)
        }
    };

    const createRoom = async (id: string, name = "FUCK HOUSE") => {
        await client?.channel.createRoom({
            groupid: id,
            groupName: name,
            avatarBase64: "",
        })
        await client?.channel.queryChannels({
            page: 1,
            size: 20,
        });
        if (client?.channel.channelList) {
            console.log(client.channel.channelList)
            await client.channel.setActiveChannel(client.channel.channelList[0]);
        }
    }

    const getRooms = async (ids: string[]) => {
        //@ts-ignore
        const data = await client?.channel.queryGroups(ids, true);
        console.log(data)
        return data;
    }

    const joinRoom = async (id: string) => {
        //@ts-ignore
        const data = await client?.channel.joinGroup(id)
        console.log(data)
        return data;
    }

    const getRoomMembers = async (id: string) => {
        //@ts-ignore
        const data = await client?.channel.getGroupMemberList({ page: 1, size: 10 }, id)
        console.log(data)
        return data;
    }

    const sendMsg = async (msg: string, to: string) => {
        client?.message.sendMessage(msg, to);
    }

    const getUserAccount = async (
        didType: WalletType = 'metamask',
        address?: string,
    ): Promise<{
        address: string;
        userExist: boolean;
    }> => {
        let didValue = address?.toLowerCase();
        if (!didValue) {
            const { address } = await Client.register.getAccount(didType);
            didValue = address;
        }
        const { userid, userExist } = await Client.register.getUserInfo({
            did_value: didValue,
            did_type: BlockChainMap[didType],
        });

        setUserAccount({
            userid,
            address: didValue as string,
            walletType: didType,
            userExist,
        });

        return {
            address: didValue as string,
            userExist,
        };
    };

    const commonLogin = async (options: {
        mainPublicKey: string;
        mainPrivateKey: string;
        userid: string;
        didType: WalletType;
        didValue: string;
        // onEventsHandler: (data: any) => void

    }) => {
        const { didType, didValue, userid } = options;

        const { tempPrivateKey, tempPublicKey, pubkeyExpiredTimestamp, mainPrivateKey, mainPublicKey } =
            await Client.register.login({
                ...options,
                password: PASSWORD,
            });

        handleLoginEvent({
            msg: '',
            type: 'login',
            data: {
                privateKey: mainPrivateKey,
                publicKey: mainPublicKey,
                tempPrivateKey,
                tempPublicKey,
                didKey: `${BlockChainMap[didType]}:${didValue}`,
                userid: userid,
                address: didValue,
                pubkeyExpiredTimestamp,
                walletType: didType,
                // onEventsHandler
            },
        });
    };

    const commonRegister = async (options: {
        mainPublicKey: string;
        mainPrivateKey: string;
        userid: string;
        didType: WalletType;
        didValue: string;
        signature: string;
        // onEventsHandler: (data: any) => void;
        didPubkey?: string;
        nickname?: string;
    }) => {
        const {
            userid,
            mainPublicKey,
            mainPrivateKey,
            signature,
            didValue,
            didType,
            // onEventsHandler,
            didPubkey = '',
            nickname = '',
        } = options;
        const params = {
            userid,
            didValue,
            mainPublicKey,
            did_pubkey: didPubkey,
            didType,
            nickname,
            avatar_url: `https://cdn.stamp.fyi/avatar/${didValue}?s=300`,
            signature,
        };
        await Client.register.register(params);

        handleLoginEvent({
            msg: '',
            type: 'register',
            data: {
                privateKey: mainPrivateKey,
                publicKey: mainPublicKey,
                address: didValue,
                walletType: didType,
            },
        });
        await commonLogin({
            mainPrivateKey,
            mainPublicKey,
            didType,
            didValue,
            userid,
            // onEventsHandler
        });
    };

    const registerByRainbow = async (nickname?: string): Promise<void> => {
        const { address, userid, walletType } = userAccount;
        console.log(address, userid, walletType, walletClient)
        const { publicKey, secretKey } = await getMainKeypairByWalletConnect({
            password: PASSWORD,
            did_value: address,
            did_type: walletType,
        });
        const { signature } = await getRegisterSignContentByWalletConnect({
            userid,
            mainPublicKey: publicKey,
            didType: walletType,
            didValue: address,
        });
        await commonRegister({
            mainPublicKey: publicKey,
            mainPrivateKey: secretKey,
            userid,
            didType: walletType,
            didValue: address,
            signature: signature as string,
            // onEventsHandler,
            nickname,
        });
    };

    const loginByRainbow = async () => {
        const { address, userid, walletType } = userAccount;
        let localMainPrivateKey = '';
        let localMainPublicKey = '';
        if (mainKeys && address.toLowerCase() === mainKeys.walletAddress.toLowerCase()) {
            localMainPrivateKey = mainKeys.privateKey;
            localMainPublicKey = mainKeys.publicKey;
        }
        if (!localMainPublicKey || !localMainPrivateKey) {
            const { publicKey, secretKey } = await getMainKeypairByWalletConnect({
                password: PASSWORD,
                did_value: address,
                did_type: walletType,
            });
            localMainPrivateKey = secretKey;
            localMainPublicKey = publicKey;
        }

        await commonLogin({
            mainPrivateKey: localMainPrivateKey,
            mainPublicKey: localMainPublicKey,
            userid,
            didType: walletType,
            didValue: address,
            // onEventsHandler
        });
    };

    const getMainKeypairByWalletConnect = async (options: {
        password: string;
        did_value: string;
        did_type: WalletType;
    }) => {
        const { password, did_value, did_type } = options;

        const { signContent } = await Client.register.getMainKeypairSignContent({
            password: password,
            did_value,
            did_type,
        });
        // const { signature } = await sendSignByWalletConnect(signContent, did_value.toLowerCase());

        const signature = await walletClient?.signMessage({
            account: did_value.toLowerCase() as `0x${string}`,
            message: signContent
        })

        const { publicKey, secretKey } = await Client.register.getMainKeypairBySignature(
            signature as string,
            PASSWORD,
        );

        setMainKeys({
            publicKey,
            privateKey: secretKey,
            walletAddress: userAccount?.address || '',
        });
        return { publicKey, secretKey };
    };
    const getRegisterSignContentByWalletConnect = async (options: {
        userid: string;
        mainPublicKey: string;
        didType: WalletType;
        didValue: string;
    }) => {
        const { userid, mainPublicKey, didValue, didType } = options;
        const { signContent } = await Client.register.getRegisterSignContent({
            userid,
            mainPublicKey,
            didType,
            didValue,
        });
        // const { signature } = await sendSignByWalletConnect(signContent, didValue.toLowerCase());
        const signature = await walletClient?.signMessage({
            account: didValue.toLowerCase() as `0x${string}`,
            message: signContent
        })

        return {
            signature,
        };
    };




    const logout = () => {
        localStorage.setItem('PRIVATE_KEY', '');
        localStorage.setItem('PUBLIC_KEY', '');
        localStorage.setItem('MAIN_PRIVATE_KEY', '');
        localStorage.setItem('MAIN_PUBLIC_KEY', '');
        localStorage.setItem('DID_KEY', '');
        localStorage.setItem('userid', '');
        localStorage.setItem('WALLET_ADDRESS', '');
        localStorage.setItem('FAST_URL', '');
        setKeys(null);
    };

    const handleLoginEvent = (eventData: any) => {
        if (eventData.data) {
            if (eventData.type === 'login') {
                const {
                    privateKey,
                    publicKey,
                    tempPrivateKey,
                    tempPublicKey,
                    didKey,
                    userid,
                    address,
                    pubkeyExpiredTimestamp,
                    // onEventsHandler
                } = eventData.data;
                // Store to browser cache
                localStorage.setItem('userid', userid);
                localStorage.setItem('PRIVATE_KEY', tempPrivateKey);
                localStorage.setItem('PUBLIC_KEY', tempPublicKey);
                localStorage.setItem('WALLET_ADDRESS', address);
                localStorage.setItem(`MAIN_PRIVATE_KEY`, privateKey);
                localStorage.setItem(`MAIN_PUBLIC_KEY`, publicKey);
                localStorage.setItem(`DID_KEY`, didKey);
                localStorage.setItem('PUBKEY_EXPIRED_TIMESTAMP', String(pubkeyExpiredTimestamp));
                // update state
                setKeys({
                    PrivateKey: tempPrivateKey,
                    PublicKey: tempPublicKey,
                    userid,
                });
                const client = Client.getInstance({
                    PrivateKey: tempPrivateKey,
                    PublicKey: tempPublicKey,
                    userid,
                });
                setClient(client);
                // client.on('channel.activeChange', onEventsHandler);
                // client.on('channel.created', onEventsHandler);
                // client.on('message.delivered', onEventsHandler);
                // client.on('channel.getList', onEventsHandler);
                // client.on('channel.updated', onEventsHandler);

            }
            if (eventData.type === 'register') {
                const { privateKey, publicKey, address } = eventData.data;
                // Store to browser cache
                localStorage.setItem('WALLET_ADDRESS', address);
                localStorage.setItem(`MAIN_PRIVATE_KEY`, privateKey);
                localStorage.setItem(`MAIN_PUBLIC_KEY`, publicKey);
            }

            if (eventData.type === 'get') {
                const { main_pubkey, pubkey, did_value, userid, wallet_address } = eventData.data;
                // Store to browser cache
                localStorage.setItem('WALLET_ADDRESS', wallet_address);
                localStorage.setItem(`MAIN_PRIVATE_KEY`, main_pubkey);
                localStorage.setItem(`MAIN_PUBLIC_KEY`, pubkey);
                localStorage.setItem('userid', userid);
            }
        }
    };



    return { keys, client, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, createRoom, sendMsg, getRooms, joinRoom, getRoomMembers, logout };
};
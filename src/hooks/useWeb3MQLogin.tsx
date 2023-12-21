import { useMemo, useState } from 'react';
import { Client, KeyPairsType, WalletType, BlockChainType } from '@web3mq/client';
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
const APPKEY = 'vAUJTFXbBZRkEDRE';
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
    const [fastestUrl, setFastUrl] = useState<string | null>(null);
    const [userAccount, setUserAccount] = useState<UserAccountType>({
        userid: address as string,
        address: address as string,
        walletType: 'metamask',
        userExist: false,
    });
    const [mainKeys, setMainKeys] = useState<MainKeysType>();



    // const userAccount: UserAccountType = {
    //     userid: walletClient?.account.address as string,
    //     address: walletClient?.account.address as string,
    //     walletType: 'metamask',
    //     userExist: false,
    // };



    const init = async () => {
        const tempPubkey = localStorage.getItem('PUBLIC_KEY') || '';
        const didKey = localStorage.getItem('DID_KEY') || '';
        const fastUrl = await Client.init({
            connectUrl: localStorage.getItem('FAST_URL'),
            app_key: APPKEY,
            env: 'dev',
            didKey,
            tempPubkey,
        });
        localStorage.setItem('FAST_URL', fastUrl);
        setFastUrl(fastUrl);
    };

    const getUserAccount = async (
        didType: WalletType = 'metamask',
        address?: string,
    ): Promise<{
        address: string;
        userExist: boolean;
    }> => {
        let didValue = address;
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
        localStorage.setItem('DID_KEY', '');
        localStorage.setItem('userid', '');
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
            }
            if (eventData.type === 'register') {
                const { privateKey, publicKey, address } = eventData.data;
                // Store to browser cache
                localStorage.setItem('WALLET_ADDRESS', address);
                localStorage.setItem(`MAIN_PRIVATE_KEY`, privateKey);
                localStorage.setItem(`MAIN_PUBLIC_KEY`, publicKey);
            }
        }
    };



    return { keys, fastestUrl, init, loginByRainbow, registerByRainbow, getUserAccount, logout };
};
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback } from 'react';

export const UserDetails: FC = () => {
    const { publicKey } = useWallet();

    const ShouldShowUserDetail = () => {
        if (!publicKey){
            return(
                <div></div>
            );
        } else {
            return(
                <div className='text-lg'>
                    <div className='p-4'>
                        Username:
                    </div>
                    <div className='p-4'>
                        Wallets:
                    </div>
                    <div className='p-4'>
                        Email:
                    </div>
                    <div className='p-4'>
                        Phone:
                    </div>
                </div>

                
            )
        }
    }

    return(
        <div>
            <ShouldShowUserDetail/>
        </div>
    )

}
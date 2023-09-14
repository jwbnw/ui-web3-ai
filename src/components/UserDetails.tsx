import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback } from 'react';

export const UserDetails: FC = () => {
    const { publicKey } = useWallet();
    const isSignedIn = false;

    const ShouldShowUserDetail = () => {
        if (!isSignedIn){
            return(
                <div>
                    <div className='blur-lg'>
                        <div className='text-lg text-left'>
                            <div className='p-4'>
                                Username:
                            </div>
                            <div className='p-4'>
                                Wallet:
                            </div>
                            <div className='p-4'>
                                Email: (Coming Soon)
                            </div>
                            <div className='p-4'>
                                Phone: (Coming Soon)
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center pt-4'>
                            <button className='btn btn-primary w-3/4'>Sign In</button>
                    </div>
                </div>
            );
        } else {
            return(
                <div className='text-lg text-left'>
                    <div className='p-4'>
                        Username:
                    </div>
                    <div className='p-4'>
                        Wallet:
                    </div>
                    <div className='p-4'>
                        Email: (Coming Soon)
                    </div>
                    <div className='p-4'>
                        Phone: (Coming Soon)
                    </div>
                    <div className='flex justify-center pt-4'>
                        <button className='btn btn-primary w-3/4'>Edit</button>
                    </div>
                </div>
            )
        }
    }

    return(
        <div className='rounded-lg border border-indigo-500/25 p-12'>
            <ShouldShowUserDetail/>
        </div>
    )

}
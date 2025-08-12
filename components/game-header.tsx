import { useRouter } from 'next/navigation';
import './game-header.css'
import { useState } from 'react';
import Image from 'next/image';
import logo from '../public/images/logo.png'
import GameEntry_down from '../public/images/GameEntry_down.png'
import GameEntry_register from '../public/images/GameEntry_register.png'



export default function GameHeader({openRegisterModal}: any) {
    const router = useRouter();
    return (
        <div className="game-header">
            <div className="game-header-logo" onClick={() => router.push('/')}>
                <Image src={logo} alt='' />
            </div>
            <div className="game-header-btn-group">
                <div className="game-header-btn">
                    <Image src={GameEntry_down} alt='' />
                </div>
                <div className="game-header-btn" onClick={openRegisterModal}>
                    <Image src={GameEntry_register} alt='' />
                </div>
            </div>
        </div>
    );
}

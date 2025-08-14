"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import './header.css'
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../public/images/logo.png'
import home_btn_bg from '../../public/images/home_btn_bg.png'



export default function Header({openRegisterModal}: any) {
    const router = useRouter();
    return (
        <div className="game-header">
            <div className="game-header-logo" onClick={() => router.push('/')}>
                <Image src={logo} alt='' />
            </div>
            <div className="game-header-btn-group">
                <div className="game-header-btn">
                    <span className="game-header-btn-name">游戏下载</span>
                    <Image src={home_btn_bg} alt='' />
                </div>
                <div className="game-header-btn" onClick={openRegisterModal}>
                    <span className="game-header-btn-name">游戏注册</span>
                    <Image src={home_btn_bg} alt='' />
                </div>
            </div>
        </div>
    );
}

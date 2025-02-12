import React from 'react'

function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center py-3 mt-5 w-100">
      <ul className='list-unstyled'>
      <li><a href="/terms" className='text-white'>利用規約</a></li>
      <li><a href="/privacy" className='text-white'>プライバシーポリシー</a></li>
        <li><a href="https://docs.google.com/forms/d/1EHYL_UqHbmDvOUZmywptZFNtk031ZDJedZ_RUjaS7qw/edit" className='text-white'>お問い合わせ</a></li>
      </ul>
      <p>開発者SNS</p>
      <div className='d-flex align-items-center justify-content-center'>
        <a href="https://note.com/kabocha_engineer"><img src="/noteSNS.svg" alt="" className='icon me-5'/></a>
        <a href="https://x.com/kabocha37"><img src="/logo-white.png" alt="" className='icon'/></a>
      </div>
      <p className='mt-3 mb-0'>Copyright 2025 Open Crew</p>
    </footer>
  )
}

export default Footer
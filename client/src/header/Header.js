import React from 'react'
import API from '../utils/API'

const Header = () => {

    const logoutUser = async () =>{
        try {
            const res = await API.get('api/v1/auth/logout')
            console.log(res)
        } catch (err) {
            console.log(err.response.data.message)
        }
    }

    const getSecret = async () =>{
        try {
            const res = await API.get('api/v1/auth/secretcontent')
            console.log(res)
        } catch (err) {
            console.log(err.response.data.message)
        }
    }
    
    return (
        <div className='header'>
        <div className='header__item' onClick={getSecret}>
            Secret!!
        </div>
        <div className='header__item' onClick={logoutUser}>
            Logout
        </div>
        </div>
    )
}

export default Header

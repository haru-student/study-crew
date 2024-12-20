import React from 'react';
import Introduction from './Introduction';
import Toppage from './Toppage';

function Home({user}) {
    if (user){
        return <Toppage />
    }
    else {
        return <Introduction />
    }
}

export default Home

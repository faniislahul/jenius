import React, {Component} from 'react';

class Loader extends Component{

    // ---------------------RENDER---------------------//
    render(){
        return(
            <div className="loading-bar">
                <div className="lds-ellipsis" >
                    <div></div><div></div><div></div><div></div>
                </div>
            </div>  
        )
    }
}

export default Loader;
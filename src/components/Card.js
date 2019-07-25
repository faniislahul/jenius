import React, {Component} from 'react';
import {put, del, post} from '../utils/ApiRequest';
import {FiTrash} from 'react-icons/fi'
const re = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

class Card extends Component{
    constructor(props){
        super(props);

        let {
            firstName, 
            lastName, 
            age,
            photo,
        } = this.props.data;

        this.state = {
            isFetching: false,
            action: this.props.action,
            click: false,
            isError: true,
            form:{
                firstName: firstName,
                lastName: lastName,
                age: parseInt(age),
                photo: re.test(photo) ? photo : ''
            }
        }
    }


    componentDidMount(){
        if(this.props.data.id === null){
            this.setState({
                click: true
            })
            setTimeout(()=>{
                this.refs['cardForm'].setAttribute('style', 'opacity: 1;')
            },400                
            );

            return;
        }

    }


    componentWillReceiveProps(nextProps) {
        let { firstName, lastName, age, photo} = nextProps.data;
        this.setState({
            form:{
                firstName: firstName,
                lastName: lastName,
                age: parseInt(age),
                photo: re.test(photo) ? photo : ''
            }
        })
      }

    onCLick= () => {
        if(this.state.click){
            return
        }
        this.flipCard();
    }
    saveContact = ()=>{
        let {firstName, lastName, age, photo} = this.state.form;
        if(!(firstName || '') || !(lastName || '') || !(age || '') || !(photo || '')){
            return;
        }
        
        if(this.props.data.id === null){
            this.createContact();
            return;
        }
        

        this.setState({
            isFetching: true
        })
        
        let path = `/contact/${this.props.data.id}`;
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            photo: photo
        }
        put(path, data,
            (res)=>{
                this.setState({
                    isFetching: false
                });
                this.flipCard();
            },
            (err)=>{
                console.log(err);
                this.setState({
                    isFetching: false,
                    isError: true
                }, ()=> {
                    this.showError()
                    this.props.onUpdate()
                });
            }
        )  
    }
    deleteContact = ()=>{
        if(this.props.data.id === null){
            this.refs['card'].setAttribute('style', 'opacity: 0');
            setTimeout(()=>{
                this.props.onDelete(this.props.index)
            }, 400)
            
            return;
        }
        
        this.setState({
            isFetching: true
        })
        let path = `/contact/${this.props.data.id}`;
        let data={
            id : this.props.data.id
        }
        del(path,data,
            (res)=>{
                this.setState({
                    isFetching: false
                });
                this.refs['card'].setAttribute('style', 'opacity: 0');
                setTimeout(()=>{
                    this.props.onDelete(this.props.index)
                }, 400)
            },
            (err)=>{
                console.log(err);
                this.setState({
                    isFetching: false,
                    isError: true
                }, ()=> this.showError());
            }
        )  
    }

    createContact = ()=>{
        this.setState({
            isFetching: true
        })
        
        let path = `/contact`;
        let data = {
            firstName: this.state.form.firstName,
            lastName: this.state.form.lastName,
            age: this.state.form.age,
            photo: this.state.form.photo
        }
        post(path, data,
            (res)=>{
                this.setState({
                    isFetching: false
                });
                this.props.onUpdate()
                this.flipCard();
            },
            (err)=>{
                console.log(err);
                this.props.onUpdate()
                this.setState({
                    isFetching: false,
                    isError: true
                }, ()=> this.showError());
            }
        )  
    }

    onCancel= (e)=>{
        e.stopPropagation();
        
        if(this.props.data.id === null){
            this.refs['card'].setAttribute('style', 'opacity: 0');
            setTimeout(()=>{
                this.props.onDelete(this.props.index)
            }, 400)
            
            return;
        }
        this.flipCard();
    }

    flipCard = ()=>{
        this.setState({
            click: !this.state.click
        }, ()=>{
            if(!this.state.click){
                setTimeout(()=>{
                    this.refs['cardForm'].setAttribute('style', 'opacity: 0')
                },400                
            );
            }

            if(this.state.click){
                setTimeout(()=>{
                    this.refs['cardForm'].setAttribute('style', 'opacity: 1;')
                },400                
                );
            }
        })
    }
    
    showError(){
        let error = this.refs['error'];
        if (error === undefined) return;

        error.setAttribute('style', 'opacity: 1; top: 0px')

        setTimeout(()=>error.setAttribute('style', 'opacity: 0; top: -20px'), 3000)
        setTimeout(()=>this.setState({isError: false}), 3800)
    }

    onFormChange = (e)=>{
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    renderCardFrom(){
        let {firstName, lastName, age, photo} = this.state.form;
        return(
            <div ref="cardForm" className="card-form">
                {this.state.isError ? this.renderError(): null}
                <form ref="form" onSubmit={(e)=>{e.preventDefault()}}>
                    <div className="form-header">
                        <h3>Edit Details</h3> 
                        {this.props.data.id || '' ? 

                            !this.state.isFetching ? 
                                <FiTrash onClick={this.deleteContact} />
                            :
                                <div className="lds-ellipsis" color="red" style={{transform: 'scale(.6',margin: 0,height: 11}}>
                                    <div></div><div></div><div></div><div></div>
                                </div> 
                            
                            
                        :
                            null
                        }
                        
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group" style={{marginRight: 10}}>
                            <label>First Name</label>
                            <input name="firstName" type="text" placeholder="Joe" value={firstName} onChange={this.onFormChange} autoFocus required/>
                        </div>
                        <div className="form-group" style={{marginLeft: 10}}>
                            <label>Last Name</label>
                            <input name="lastName" type="text" placeholder="Doe" value={lastName} onChange={this.onFormChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Age</label>
                        <input name="age"  type="number" placeholder="26" value={age} onChange={this.onFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <input name="photo"  type="text" placeholder="https://imgulr.com/ajsd7sj" value={photo} onChange={this.onFormChange} required/>
                    </div>
                    <div className="action-bar">
                        <button type="cancel" onClick={this.onCancel} style={{marginRight: 10}}>Cancel</button>
                        
                        {!this.state.isFetching ? 
                            <button type="action" onClick={this.saveContact} style={{marginLeft: 10}}>Save </button>
                        :
                        <button type="action" onClick={this.saveContact} style={{marginLeft: 10}}>
                            <div className="lds-ellipsis" color="white"  style={{margin: 0,height: 11}}>
                                <div></div><div></div><div></div><div></div>
                            </div> 
                        </button>
                        }
                        
                    </div>
                </form>
                
                
            </div>    
            
        )
    }
    renderError(){
        return(
            <div ref="error" className="error">
                <span>Oops, something's wrong!</span>
            </div>
        )
    }
    render(){
        let {firstName, lastName, age, photo} = this.state.form;
        return(
            <div className="card-shell">
                <div ref="card" className={this.state.click ? "card flip" : 'card'} onClick={this.onCLick}> 
                        
                    <div className="card-header">
                        <div className="avatar" style={{backgroundImage:`url(${photo})`}}>
                        </div>
                    </div>
                    
                    <div ref="cardBody" className="card-body">
                    
                        <div ref="cardDetail" className="card-detail">
                            <h3>{firstName} {lastName}</h3>
                            <span>Age: {age}</span>
                        </div>

                        {this.renderCardFrom()}
                       
                    </div>    
                    
                        
                    
                </div>

            </div>
        )
    }

}

export default Card;
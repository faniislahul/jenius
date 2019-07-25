import React, {Component} from 'react';
import {get} from '../utils/ApiRequest';
import Loader from './Loader';
import Card from './Card';
import {FiSearch} from 'react-icons/fi';

class Home extends Component{
    constructor(props){
        super(props);

        this.state = {
            isFetching: true,
            cards: [],
            query: '',
            
        }
    }
    componentDidMount(){
        this.loadContact()
    }

    loadContact(){
        let path = '/contact';

        get(path, 
            (res)=>{
                this.setState({
                    cards: res.data,
                    isFetching: false
                })
            },
            (err)=>{
                console.log(err);
            }
        )  
    }

    newCard = () => {
        let item  = {
            id:null,
            firstName: '', 
            lastName: '', 
            age: 0,
            photo: ''
        }
        let cards = this.state.cards;
        cards.push(item);
        this.setState({
            cards: cards
        })
    }

    updateContact = ()=>{
        this.loadContact()
    }
    deleteCard = (index)=>{
        let cards = this.state.cards;
        cards.splice(index, 1);
        this.setState({
            cards: cards
        })
    }

    onQueryChange = (e)=>{
        this.setState({query: e.target.value})
    }

    renderCard(){
        let {cards, query} = this.state;
        let stack = [];

        let searchFilter = cards.filter(
            (item)=> 
                item['firstName'].toLowerCase().includes(query.toLowerCase()) ||
                item['lastName'].toLowerCase().includes(query.toLowerCase()) ||
                item['id'] === null
            ) 
            
        
        searchFilter.map((item, index)=> 
            stack.push(
                <Card 
                    key={index} 
                    index={index} 
                    data={item} 
                    onUpdate={this.updateContact} 
                    onDelete={this.deleteCard} />
                    )
        )

        return stack.reverse();
    }

    render(){
        if(this.state.isFetching){
            return(
                <Loader />
            )
        }
        return(
            <div className="container">
                <h1>Contact Book</h1>
                <div className="input-bar">
                    <button className="add-new-button" style={{gridColumn: 'span 1'}} onClick={this.newCard}>New Contact</button>
                    <div className="search-compound" style={{gridColumn: 'span 2'}}>
                        <button><FiSearch /></button>
                        <input 
                            ref="searchInput" 
                            className="input" 
                            placeholder="Search contact name.." 
                            type="text" 
                            onChange={this.onQueryChange} 
                            value={this.state.query}
                            />
                        
                    </div>
                    
                    
                </div>
                
                <div className="card-container">
                    {this.renderCard()}
                </div>
                
            </div>
        )
    }

}

export default Home;
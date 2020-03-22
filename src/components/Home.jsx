/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BGvid from './BGvid';
import Footer from './Footer';
import Nav from './Nav';
import AmazonItem from './AmazonItem';
import AdBlockDetect from 'react-ad-block-detect';
import uuid from 'uuid';
import axios from 'axios';

// YOUTUBE API KEYS
let key = 'AIzaSyCL9rLbM01CmVdUgYZWFYUIqcYUsso7MDQ';
let key2 = 'AIzaSyCRlttHdu2haccytjzgvKVCkNIXc_PWR5A';
let key3 = 'AIzaSyCzEMTvE1OqDWQA3vkvsUev4WO9nQDMh6g';
let key4 = 'AIzaSyCM2mLL21gJ3mWb2ETYFVKwHbTdBQ_94zY';

export default class Home extends Component {

    state = {
        links: [],
        prevLinks: [],
        amazonItems: [],
        ytReady: false,
        amReady: false
      }

    async componentDidMount(){

        window.scrollTo(0,0);
        if(localStorage.getItem('list')){
          const list = window.localStorage.getItem('list');
          const parsedList = JSON.parse(list);
          
          await parsedList.map( async item => {

            //YOUTUBE API REQUEST

            await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=${item.value}&type=video&videoEmbeddable=true&key=${key4}`)
            .then(res=>res.json())
            .then(async data=>{
                await this.setState({
                    prevLinks: data,
                })

                this.state.links.push(this.state.prevLinks)
                
            })
            
            //CUSTOM API WEB SCRAPING AMAZON
            //pending heroku deployment
            console.log(item.value)
            
            
            let r = await axios.get(`https://shrouded-mountain-42240.herokuapp.com/scrapeAmazon?q=${item.value}`).catch(err => console.error(err))
            
            console.log(r)

            let num = Math.floor(Math.random() * (r.data.amazonList.length - 5));
            console.log(num)
            for(let i=(num+4); i<(num+9);i++){
                console.log(r.data.amazonList[i])
                if(r.data.amazonList[i]){
                    await this.state.amazonItems.push(r.data.amazonList[i])
                }
            }
            console.log(this.state.amazonItems)

            await this.setState({
                ytReady: true,
                amReady: true
            })
        
        })
            
        }
        
    }

    addToFavoriteVideos = (video,title) => {
        const Items={
            id:uuid.v4(),
            value:video,
            title: title
        };

        if(localStorage.getItem('favoriteVideos')==null){
            const favoriteVideos=[]
            favoriteVideos.push(Items);
            localStorage.setItem("favoriteVideos",JSON.stringify(favoriteVideos))
        }

        else {
            const favoriteVideos=JSON.parse(localStorage.getItem('favoriteVideos'))
            favoriteVideos.push(Items)
            localStorage.setItem("favoriteVideos",JSON.stringify(favoriteVideos))
        }
    }

    addToFavoriteItems = (item) => {
        const Items={
            id:uuid.v4(),
            value:item
        };

        if(localStorage.getItem('favoriteItems')==null){
            const favoriteItems=[]
            favoriteItems.push(Items);
            localStorage.setItem("favoriteItems",JSON.stringify(favoriteItems))
        }

        else {
            const favoriteItems=JSON.parse(localStorage.getItem('favoriteItems'))
            favoriteItems.push(Items)
            localStorage.setItem("favoriteItems",JSON.stringify(favoriteItems))
        }        
    }


    showVideos = () => {
        console.log('show videos')
        return this.state.links.map(eachLink=> {
            return eachLink.items.map(eachVideo => {
                
                return (
                    <div key={uuid.v4()} className="tile">
                    
                        <div className="container">
                        
                            <iframe width="100%" height="100%" title='test' src={`https://www.youtube.com/embed/${eachVideo.id.videoId}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            
                            <button onClick={() => this.addToFavoriteVideos(eachVideo.id.videoId, eachVideo.snippet.title)} className="tile--yt__fav-btn">Add to Favorites <i className="fas fa-check tile--yt__fav-btn__success"></i>
                            </button>
                            
                            
                        </div>
                    </div>
                )
            })
        }) 
    }

    showAmazon = () => {
        console.log('show amazon')
        return this.state.amazonItems.map(eachItem=> {
            if(eachItem.title !== '' && eachItem.title !== 'gp'){
                return (
                    <div key={uuid.v4()} className="tile-amazon">
                        <AmazonItem title={eachItem.title} image={eachItem.img} link={`https://www.amazon.com/${eachItem.url}`} price={eachItem.price} addToFavoriteItems={this.addToFavoriteItems} home={true}/>
                    </div>
                )           
            }
            
        }) 
    }

    showLoading = () => {
        return <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    }

    
    
    /////////////////////////////////////////////////////////////

    render() {
        return (
            <main className="home">
                <div className="header__logo-box">
                    <Link to="/"><div className="header__logo"></div></Link>
                </div>    
                <Nav main={false} />
                <div className="home--intro">
                    <BGvid fav={true}/>
                    <section className="home--intro__quote">
                        <h1 className="heading-primary--quote">Live Life Your Way.</h1>
                    </section>
                    <a href="#yt">
                    <div className="arrow">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    </a>
                </div>
                
                <div className="home--main">
                    <section id="yt" className="home--main__youtube">

                        <a href="http://www.youtube.com">
                            <img className="home--main__youtube--img" alt="YT logo" src="./images/yt_logo_rgb_dark.png"/>
                        </a>
                        <div className="home--main__youtube--carousel">
                            <div className="row--youtube">
                                <div className="row__inner">
                                    {this.state.ytReady ? this.showVideos() : this.showLoading()}
                                </div>
                            </div>
                        </div>
                        
                    </section>
                    <section className="home--main__amazon">
                        <AdBlockDetect>
                            <p>please disable adblock to see this amazon section</p>
                        </AdBlockDetect>
                        <a href="http://www.amazon.com">
                            <img className="home--main__amazon--img" alt="Amazon logo" src="./images/amazon-logo.png"/>
                        </a>
                        
                        <div className="home--main__amazon--carousel">
                        <div className="row--amazon">
                            <div className="row__inner-amazon">
                                {this.state.amReady ? this.showAmazon() : this.showLoading()}
                            </div>
                        </div>                  
                        </div>
                    </section>
                </div>
                <Footer />            
            </main>
        )
    }
}

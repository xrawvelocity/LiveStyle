/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import BGvid from './BGvid';
// import YouTube from './YouTube'
import Footer from './Footer';

let key = 'AIzaSyCL9rLbM01CmVdUgYZWFYUIqcYUsso7MDQ';

export default class Home extends Component {

    state = {
        links: [],
        prevLinks: [],
        ready: false
      }

    async componentDidMount(){
        console.log('componentdidmount')
        if(localStorage.getItem('list')){
          const list = window.localStorage.getItem('list');
            const parsedList = JSON.parse(list);
            await parsedList.map( async item => {
              await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=${item.value}&type=video&videoEmbeddable=true&key=${key}`)
              .then(res=>res.json())
              .then(async data=>{
                  
                  this.setState({
                      ready: true
                  })
              })
                
              
            })
            console.log(this.state.links)
            
        }
    }

    showVideos = () => {
        console.log('showvideos')
        return this.state.links.map(eachLink=> {
            return eachLink.items.map(eachVideo => {
                return (
                    <div className="tile">
                    <iframe width="290" height="180.625" title='test' src={`https://www.youtube.com/embed/${eachVideo.id.videoId}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                )
            })
        }) 
    }

    showCategories = () => {
        const list = window.localStorage.getItem('list');
        const parsedList = JSON.parse(list);
        return parsedList.map(item => {
            return item.value + " "
        })
    }

    showLoading = () => {
        return <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    }

    render() {
        
        return (
            <main className="home">

            
            <marquee className="home--scrolling-text" behavior="scroll" scrollamount="5" direction="left">{this.showCategories()}</marquee>


                <div className="home--intro">
                    <BGvid />
                    <section className="home--intro__quote">
                        <h1 className="heading-primary--quote">Live Life Your Way.</h1>
                    </section>
                    <div className="arrow">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <div className="home--main">
                    <section className="home--main__youtube">

                        <a href="http://www.youtube.com">
                        <img className="home--main__youtube--img" alt="YT logo" src="./images/yt_logo_rgb_dark.png"/>
                        </a>
                        <div className="home--main__youtube--carousel">
                        <div className="row--youtube">
                        <div className="row__inner">
                        {/* {this.showVideos()} */}
                            {this.props.ready ? this.showVideos() : this.showLoading()}
                        </div>
                        </div>
                        </div>
                        
                    </section>
                    <section className="home--main__amazon"></section>
                </div>
                <Footer />            
            </main>
        )
    }
}
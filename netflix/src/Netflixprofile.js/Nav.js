import { Link, withRouter } from 'react-router-dom'
import { Component } from "react"
import { MdCancel } from 'react-icons/md'
import './Css/Profile.css'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'
const url = 'https://login-with-jwt-richards.herokuapp.com/movies'
const carturl = 'https://login-with-jwt-richards.herokuapp.com/cart'
class Profilenav extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            image: '',
            visible: '',
            movies: '',
            selectvisible: '',
            listdata: '',
            searchbarVisible: '',
            cancel: 'true',
            inputvalue: '',
            listvisible: 'true',
        }
    }
    logouthandler = () => {
        sessionStorage.removeItem('movie_name')
        sessionStorage.removeItem('movie_image')
        sessionStorage.removeItem('movie_id')
        sessionStorage.removeItem('profile_name')
        sessionStorage.removeItem('profile_image')
        sessionStorage.removeItem('logintoken')
        sessionStorage.removeItem('logintoken')
        sessionStorage.removeItem('dob')
        this.props.history.push('/signin')
    }

    visiblehandler = () => {
        this.setState({ visible: !this.state.visible })
    }
    inputvisiblehandler = () => {
        this.setState({ selectvisible: !this.state.selectvisible })

    }
    changehandler = (e) => {
        const keyword = e.target.value
        // console.log(keyword)
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state.inputvalue)
        if (this.state.movies) {
            const filterlisting = this.state.movies.filter(item =>
            (
                item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
            ))
            console.log(filterlisting)
            this.setState({
                listdata: filterlisting
            })
        }


    }
    idhandler = (e) => {
        const value = e.target.id
        // console.log(value)
        // console.log(this.state.movies)
        const cartimage = this.state.movies.filter(item =>
        (
            parseInt(item.id) === parseInt(value)
        ))
        // console.log(cartimage)
        axios.post(carturl, cartimage)

    }
    dataselect = (e) => {
        const id = e.target.id
        const cartimage = this.state.movies.filter(item =>
        (
            parseInt(item.id) === parseInt(id)
        ))
        sessionStorage.setItem('movie_name', cartimage[0].name)
        sessionStorage.setItem('movie_image', cartimage[0].imageurl)
        sessionStorage.setItem('movie_id', cartimage[0].id)
        this.props.history.push('/moviepage')
        console.log(cartimage)
    }
    renderlist = (data) => {
        if (data) {
            return (
                data.map(item =>
                (
                    <li id={item.id} onClick={this.dataselect}> { item.name}</li>

                ))
            )

        }
    }
    setsearchvisible = () => {
        this.setState({ searchbarVisible: 'visible', cancel: !this.state.cancel })
    }
    cancel = () => {
        this.setState({ searchbarVisible: '', cancel: !this.state.cancel, inputvalue: '', listdata: '' })
    }
    render() {
        return (
            <div className='profile_container'>
                <div>
                    <div className='background_img'>
                        <img src={sessionStorage.getItem('movie_image')} alt='joker' />
                    </div>
                    <div className='backgroundimg_text'>
                        <h1>{sessionStorage.getItem('movie_name')}</h1>
                        {sessionStorage.getItem('movie_name') && <button id={sessionStorage.getItem('movie_id')} onClick={this.idhandler} className=''>Add to watchlist</button>}
                    </div>
                </div>
                <div className='Profile_nav' >

                    <div className='nav_left'>
                        <img src='https://download.logo.wine/logo/Netflix/Netflix-Logo.wine.png' alt='/'></img>
                        <div className="nav_left_text">
                            <Link to='/series' style={{ textDecoration: 'none' }}>
                                <div className='nav_select'>
                                    <h3>Series</h3>
                                </div>
                            </Link>
                            <Link to='/flims' style={{ textDecoration: 'none' }}>
                                <div className='nav_select'>
                                    <h3>Flims</h3>
                                </div>
                            </Link>
                            <Link to='/documantaries' style={{ textDecoration: 'none' }}>
                                <div className='nav_select'>
                                    <h3>Documantaries</h3>
                                </div>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} onClick={this.logouthandler}>
                                <div className='nav_logout'>
                                    <h3>Logout</h3>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className='nav_right'>
                        <div className='nav_search'>
                            {
                                this.state.searchbarVisible && <input placeholder='search data here' onClick={this.inputvisiblehandler} name='inputvalue' value={this.state.inputvalue} onChange={this.changehandler} autocomplete="off" />
                            }
                            {
                                this.state.listvisible && <div className='navsearch_list'>
                                    {this.renderlist(this.state.listdata)}
                                </div>
                            }
                            {
                                this.state.cancel && <FiSearch onClick={this.setsearchvisible} />
                            }
                            {
                                !this.state.cancel && <MdCancel onClick={this.cancel} />
                            }
                        </div>
                        <div className='navimage_container'>
                            <div className='navuser_image' onClick={this.visiblehandler}>
                                <img src={this.state.image} alt='/' />
                            </div>
                            {this.state.visible && <div className='navimage_list' >
                                <div className="w3-center w3-animate-top">
                                    <li><Link style={{ textDecoration: "none" }}> Hi {sessionStorage.getItem('profile_name')}</Link></li>
                                    <li><Link to='/watchlist' style={{ textDecoration: "none" }}>Watchlist</Link></li>
                                    <li onClick={this.logouthandler}>logout</li>
                                </div></div>}
                        </div>
                    </div>
                </div >

            </div >
        )
    }
    componentDidMount() {

        this.setState({
            name: sessionStorage.getItem('profile_name'),
            image: sessionStorage.getItem('profile_image'),

        })
        axios.get(url).then(res => { this.setState({ movies: res.data }) })

    }

}
export default withRouter(Profilenav)
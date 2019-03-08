import React from 'react';

import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { InstagramIcon } from './lib/CustomSVGIcons'
import grey from '@material-ui/core/colors/grey';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import InsertPost from './posts/InsertPost'
import { isLoggedInUser, getPosts } from './lib/Service';
import  PostPreview from './posts/PostPreview';

const grey500 = grey['500'];

class Home extends React.Component {

  state = {
    open:false,
    posts: [],
    current_user_id: '',
    user_name:''
  };
  
  async componentDidMount () {
   const current_user_id = await isLoggedInUser();
   const posts = await getPosts();
   console.log(posts)
   this.setState({posts: posts, current_user_id:current_user_id });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleSignout = () => {
    this.props.history.push("/signout")
  }

  handleClose = async () => {
    this.setState({ open: false });
    const posts = await getPosts();
    this.setState({posts: posts});
  };

  render() {
   const { current_user_id, posts, open } = this.state;

   if (current_user_id === '') {
     return <div> Please <Link to="/login">login</Link> to continue....<br/>If do not have account please <Link to="/signup">signup</Link> first!!!</div>
   }

   let renderPostPreview = '';
   if (posts.length > 0) {
     renderPostPreview = posts.map((post,key) => {
        return (
          <PostPreview 
            post={post}
            key={key}
            current_user_id={current_user_id}
          />
        )
     });
   }

    return (
     <div>
       <AppBar position="fixed" color="default">
          <Toolbar>
            <Typography 
              className="instagram-header"
              variant="h6" 
              color="inherit"
            >
              <InstagramIcon/>
            </Typography>
            <span
              style={{
                backgroundColor: grey500,
                display: 'block',
                height: 32,
                marginLeft: '14px',
                marginRight: '14px',
                minWidth: 1
              }}
            />
            <div className="search">
             <div>
               <SearchIcon />
             </div>
             <InputBase
               placeholder="Search…"
             />
           </div>
           <div style={{ display: 'flex', marginLeft:'auto' }}>
             <Button
               variant="contained"
               onClick={this.handleOpen}
             >
               Upload post
             </Button>
             <Button
               variant="contained"
               onClick={this.handleSignout}
             >
               sign out
             </Button>
           </div>
          </Toolbar>
        </AppBar>
        <div>
        { open && (
          <InsertPost
            current_user_id={current_user_id}
            open={open}
            handleClose={this.handleClose}
          />
        )}
        {renderPostPreview}
        </div>
      </div>
    );
  }
}

export default Home;

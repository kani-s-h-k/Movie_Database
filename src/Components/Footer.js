import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
function Footer() {
  return (
    <div
      style={{
        marginTop: "10vh",
        height: "max-content",
        backgroundColor: "black",
        display:'flex',
        flexDirection:'column',
        color: "white",
      }}
    >
      <div
        className=""
        style={{ height: "48vh", display: "flex", alignItems: "center",justifyContent:'space-around',borderBottom:'1px solid grey' }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "35%",
          }}
        >
          <h2 style={{fontWeight:'bold'}}>Subscribe for More</h2>
          <p className="gerneANDratingheading subscribePara">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam
            aliquid dolor repudiandae quaerat maxime voluptatum maiores hic!
            Hic, in non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, tempore?
          </p>
        </div>
        <div className="input-group mb-3 p-4" style={{width:'35%'}}>
          <input
            type="email"
            className="form-control bg-dark text-white"
            placeholder="Your email address"
            aria-label="Your email address"
            aria-describedby="basic-addon2"
          />
          <button  type="submit" className="input-group-text text-white bg-dark " id="basic-addon2">
            Send
          </button>
        </div>
      </div>
          <div style={{height:'45vh',display: "flex", alignItems: "center",justifyContent:'space-around'}}>
            <div style={{display:'flex',flexDirection:'column'}}>
                <h4 style={{marginBottom:'5vh',fontSize:'28px',fontWeight:'bold'}}>FxRcs</h4>
                <ul
              className="navbar-nav"
              style={{ color: "white",display:'flex',flexDirection:'row' }}
            >
              <li>
                <InstagramIcon
                  style={{ fontSize: "17px", cursor: "pointer",marginRight:'4vh' }}
                />
              </li>
              <li>
                <TwitterIcon style={{ fontSize: "17px", cursor: "pointer",marginRight:'4vh' }} />
              </li>
              <li>
                <LinkedInIcon style={{ fontSize: "17px", cursor: "pointer",marginRight:'4vh' }} />
              </li>
              <li>
                <PinterestIcon
                  style={{ fontSize: "17px", cursor: "pointer",marginRight:'4vh' }}
                />
              </li>
            </ul>
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
                <ul>
                    <li style={{listStyle:'none',fontSize:'15px',marginBottom:'1vh' }}>PAGES</li>
                    <li className="footerListTitles">Home</li>
                    <li className="footerListTitles">About Us</li>
                    <li className="footerListTitles">Studio</li>
                    <li className="footerListTitles">Contact Us</li>
                </ul>
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
                <ul>
                    <li style={{listStyle:'none',fontSize:'15px',marginBottom:'1vh' }}>OUR STUDIO</li>
                    <li className="footerListTitles">Services</li>
                    <li className="footerListTitles">Our Works</li>
                    <li className="footerListTitles">Team</li>
                    <li className="footerListTitles">History</li>
                </ul>
            </div>
            <div style={{display:'flex',flexDirection:'column',width:'25%',justifyContent:'space-between'}}>
            <h4 style={{marginBottom:'2vh',fontSize:'16px'}}>FxRcs STUDIO</h4>
            <p style={{fontSize:'14px',color:'grey',fontWeight:'bold',marginBottom:'1vh'}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis repellendus perferendis inventore, vero tempora minus sint recusandae ipsa temporibus! Quis, cumque?</p>
            </div>

          </div>
    </div>
  );
}

export default Footer;

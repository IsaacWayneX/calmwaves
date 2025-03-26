import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
    color: #1a1a1a;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 2.5rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
        padding: 1rem 1.5rem;
        flex-direction: column;
        gap: 1rem;
    }
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 800;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #00695c 0%, #4db6ac 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Righteous', 'Poppins', sans-serif;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
    
    span {
        font-size: 2rem;
        filter: drop-shadow(0 0 2px rgba(0, 105, 92, 0.3));
        transform: translateY(-2px);
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
`;

const NavLink = styled.a`
    text-decoration: none;
    color: #333;
    font-weight: 500;
`;

const Button = styled.button`
    padding: ${props => props.primary ? '1.2rem 2.5rem' : '0.8rem 1.5rem'};
    border-radius: 12px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: ${props => props.primary ? '1.2rem' : '1rem'};

    @media (max-width: 768px) {
        padding: ${props => props.primary ? '1rem 2rem' : '0.6rem 1.2rem'};
        font-size: ${props => props.primary ? '1.1rem' : '0.9rem'};
        width: ${props => props.primary ? '90%' : 'auto'};
    }
    
    ${props => props.primary ? `
        background: #00695c;
        color: #fff;
        box-shadow: 0 0 15px rgba(0, 105, 92, 0.5);
        &:hover {
            background: #004d40;
            box-shadow: 0 0 20px rgba(0, 105, 92, 0.7);
        }
    ` : `
        background: transparent;
        color: #333;
    `}
`;

const HeroSection = styled.section`
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
`;

const Title = styled.h1`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
    font-weight: 800;
    letter-spacing: -1px;
    font-family: 'Georgia', serif;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
`;

const Subtitle = styled.p`
    font-size: 1.4rem;
    max-width: 700px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
    color: #444;
    font-weight: 500;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        font-size: 1.1rem;
        margin: 0 auto 2rem;
        padding: 0 1rem;
    }
`;

const ProfileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 3rem auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin: 2rem auto;
        padding: 0 1rem;
    }
`;

const ProfileCard = styled.div`
    text-align: center;
    background: ${props => props.bg || '#FFE4E1'};
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }

    h3 {
        margin-top: 1rem;
        font-size: 1.5rem;
        color: #333;
    }
`;

const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 4px solid white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const DecorativeStar = styled.span`
    position: absolute;
    font-size: 2rem;
    color: #FFD700;
    z-index: 1;
    animation: float 3s ease-in-out infinite;

    &:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }
    &:nth-child(2) { top: 20%; right: 10%; animation-delay: 0.5s; }
    &:nth-child(3) { bottom: 15%; left: 15%; animation-delay: 1s; }
    &:nth-child(4) { top: 40%; right: 15%; animation-delay: 1.5s; }
    &:nth-child(5) { bottom: 30%; right: 5%; animation-delay: 2s; }
    &:nth-child(6) { top: 15%; left: 50%; animation-delay: 2.5s; }

    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
    }
`;

const GreenSection = styled.section`
    background: linear-gradient(135deg, #004d40 0%, #00695c 100%);
    color: #fff;
    padding: 6rem 2rem;
    text-align: center;
`;

const Footer = styled.footer`
    background: #1a1a1a;
    color: #fff;
    padding: 4rem 2rem;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 0 1rem;
    }
`;

const FooterSection = styled.div`
    h4 {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
    }
    ul {
        list-style: none;
        padding: 0;
        li {
            margin-bottom: 0.8rem;
            a {
                color: #fff;
                text-decoration: none;
                opacity: 0.8;
                transition: opacity 0.3s;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
`;

const Copyright = styled.div`
    text-align: center;
    padding-top: 3rem;
    margin-top: 3rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 0.9rem;
    opacity: 0.8;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 3rem auto;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin: 2rem auto;
        padding: 0 1rem;
    }
`;

const FeatureCard = styled.div`
    text-align: center;
    padding: 2rem;
`;

const FooterLogo = styled(Logo)`
    font-size: 3rem;
    justify-content: center;
    margin-top: 2rem;
    
    span {
        font-size: 4rem;
    }
`;

const Landing = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Nav>
                <Logo>
                    <span>🌊</span>
                   Calm Waves
                </Logo>
                <NavLinks>
                    <NavLink href="#">Services</NavLink>
                    <NavLink href="#">Clinics</NavLink>
                    <NavLink href="#">Treatments</NavLink>
                </NavLinks>
            </Nav>

            <HeroSection>
                <DecorativeStar>✨</DecorativeStar>
                <DecorativeStar>⭐</DecorativeStar>
                <DecorativeStar>🌟</DecorativeStar>
                <DecorativeStar>🌠</DecorativeStar>
                <DecorativeStar>💫</DecorativeStar>
                <DecorativeStar>⚡</DecorativeStar>
                <Title>Mental health is wealth</Title>
                <Subtitle>
                    To live your life to the fullest, we're continuing to find ways to prevent
                    mental health problems.
                </Subtitle>
                <Button primary onClick={() => navigate('/auth')}>Get Started</Button>

                <ProfileGrid>
                    <ProfileCard bg="#FFE4E1">
                        <ProfileImage src="https://img.freepik.com/free-photo/lifestyle-summer-people-emotions-concept-close-up-portrait-carefree-happy-handsome-man-looking-upper-left-corner-banner-laughing-standing-basic-white-t-shrit-yellow-background_1258-60013.jpg" alt="Happy Person 1" />
                        <h3>Happier</h3>
                    </ProfileCard>
                    <ProfileCard bg="#E0FFF0">
                        <ProfileImage src="https://img.freepik.com/free-photo/close-up-portrait-beautiful-carefree-girl-woman-laughing-smiling-showing-tongue-silly-face-standing-white-background_176420-47252.jpg" alt="Happy Person 2" />
                        <h3>Calm</h3>
                    </ProfileCard>
                    <ProfileCard bg="#E6E6FA">
                        <ProfileImage src="https://img.freepik.com/free-photo/young-woman-laughing-looking-cheery_176474-95747.jpg" alt="Happy Person 3" />
                        <h3>Positive</h3>
                    </ProfileCard>
                </ProfileGrid>
            </HeroSection>

            <GreenSection>
                <Title style={{ color: '#fff' }}>We help you to grow confidence at any age</Title>
                <Subtitle style={{ color: '#fff', opacity: 0.9 }}>
                    Taking regular practice can balance structural changes in the brain which help reduce stress
                    and less some stuffs.
                </Subtitle>

                <FeatureGrid>
                    <FeatureCard>
                        <h3>Bring inner peace</h3>
                        <p>Helping forms generate more peaceful solutions.</p>
                    </FeatureCard>
                    <FeatureCard>
                        <h3>Find more joy</h3>
                        <p>Feel utterly less stressed in just first 90 days.</p>
                    </FeatureCard>
                    <FeatureCard>
                        <h3>Healing program</h3>
                        <p>Do it for yourself, and everyone gets really here.</p>
                    </FeatureCard>
                    <FeatureCard>
                        <h3>Positive psychology</h3>
                        <p>Put your mind to bed, wake up fully refreshed.</p>
                    </FeatureCard>
                </FeatureGrid>
            </GreenSection>
            <Footer>
                <FooterContent>
                    <FooterSection>
                        <h4>About Us</h4>
                        <ul>
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Careers</a></li>
                        </ul>
                    </FooterSection>
                    <FooterSection>
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Therapy</a></li>
                            <li><a href="#">Counseling</a></li>
                            <li><a href="#">Support Groups</a></li>
                        </ul>
                    </FooterSection>
                    <FooterSection>
                        <h4>Contact</h4>
                        <ul>
                            <li><a href="#">Get in Touch</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </FooterSection>
                </FooterContent>
                <Copyright>
                    © 2025 Calm Waves. All rights reserved.
                </Copyright>
                <FooterLogo>
                    <span>🌊</span>
                    Calm Waves
                </FooterLogo>
            </Footer>
        </Container>
    );
};

export default Landing;
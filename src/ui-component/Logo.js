import { Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import creador from 'assets/images/creador.png';
import { useSelector } from 'react-redux';

const NeumorphicContainer = styled('div')({
  borderRadius: '10px',
  width: '150px',
  height: '60px',
  // padding: '8px',
  display: 'flex',
  alignItems: 'center'
});

const Logo = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const keyframes = `
  @keyframes colorChange {
    0% {
      color: red;
    }
    50% {
      color: red;
    }
    51% {
      color: black;
    }
    100% {
      color: black;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  `;

  return (
    <NeumorphicContainer
      style={{
        background: customization.darkMode ? 'linear-gradient(145deg, #323232, #3b3b3b)' : 'white',
        boxShadow: customization.darkMode ? '5px 5px 11px #212121, -5px -5px 11px #505050' : '2px 2px 5px #9B9B9B, -5px -5px 10px #eef2f6'
      }}
    >
      <style>{keyframes}</style>
      <Avatar
        src={creador}
        style={{
          width: '60px',
          height: '60px',
          margin: '0 5px',
          background: customization.darkMode ? 'transparent' : 'white'
        }}
      />
      <Typography
        style={{
          color: theme.palette.grey[900],
          marginLeft: 0,
          marginRight: 1,
          fontSize: '22px'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '0.1s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '0.1s'
            }}
          >
            S
          </span>
        </span>
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '3.2s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '3.2s'
            }}
          >
            o
          </span>
        </span>
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '6.3s'
          }}
        >
          {/* <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '6.3s'
            }}
          >
            V
          </span> */}
        </span>
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '9.4s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '9.4s'
            }}
          >
            G
          </span>
        </span>
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '12.5s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '12.5s'
            }}
          >
            o
          </span>
        </span>
        {/* <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '15.6s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '15.6s'
            }}
          >
            4
          </span>
        </span>
        <span
          style={{
            display: 'inline-block',
            animation: 'bounce 1s infinite',
            animationDelay: '18.7s'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'colorChange 3s infinite',
              animationDelay: '18.7s'
            }}
          >
            R
          </span>
        </span> */}
      </Typography>
    </NeumorphicContainer>
  );
};

export default Logo;

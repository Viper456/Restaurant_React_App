import { Container, Typography } from "@material-ui/core";
import "./App.css";
import Order from './components/Order';

export default function App() {
   return (
      <Container className='mainContainer' maxWidth="md">
         <Typography gutterBottom variant="h2" align="center">
            Вебзастосунок "Ресторан"
         </Typography>
         <Order />
      </Container>
   );
}

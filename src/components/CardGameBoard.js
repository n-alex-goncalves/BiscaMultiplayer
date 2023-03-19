import React from 'react';
// import { createDeckAndDraw, Draw } from './api'
import { BoardLayout, CardLayout, Row, Column } from './layout';

class CardGameBoard extends React.Component {
    state = {
        card1ImageUrl: null,
        card2ImageUrl: null,
        card3ImageUrl: null
    }
    componentDidMount = async () => {
        // Call the API endpoint to start the game and get the deck ID
        // const response = await fetch('http://localhost:3000/startGame', {method: 'POST',});
        // const data = await response.json();
        this.setState({ 
            card1ImageUrl: 'https://deckofcardsapi.com/static/img/back.png',
            //card2ImageUrl: data.card2ImageUrl,
            /* card3ImageUrl: data.card3ImageUrl */ });
    }

    render() {
        // https://deckofcardsapi.com/static/img/back.png
        return (
        <Column>
            <Row>
                <BoardLayout>
                    <Row>
                        <Column>
                            <CardLayout> <img src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card1"></img> </CardLayout>
                        </Column>
                        <Column>
                            <CardLayout> <img src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card2"></img> </CardLayout>
                        </Column>
                        <Column>
                            <CardLayout> <img src={'https://deckofcardsapi.com/static/img/back.png'} alt="P2Card3"></img> </CardLayout>
                        </Column>
                    </Row>
                </BoardLayout>
            </Row>
            <Row>
                <BoardLayout>
                    <Row>
                        <Column>
                            
                        </Column>
                        <Column>
                           
                        </Column>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Column>
                            
                        </Column>
                        <Column>
                            
                        </Column>
                    </Row>
                </BoardLayout>
            </Row>
            <Row>
                <BoardLayout>
                    <Row>
                        <Column>
                            <CardLayout> <img src={this.state.card1ImageUrl} alt="P1Card1"></img> </CardLayout>
                        </Column>
                        <Column>
                            <CardLayout> <img src={this.state.card2ImageUrl} alt="P1Card2"></img> </CardLayout>
                        </Column>
                        <Column>
                            <CardLayout> <img src={this.state.card3ImageUrl} alt="P1Card3"></img> </CardLayout>
                        </Column>
                    </Row>
                </BoardLayout>
            </Row>
        </Column>
        )
    }
}

export default CardGameBoard
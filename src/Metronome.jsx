import React, {Component} from 'react';
import {Button, Input, Segment, Header} from 'semantic-ui-react';

class Metronome extends Component
{
    constructor() {
        super();
    }

    render() {
        return (
            <Segment className='widget'>
                <Header size='huge'>Metronome</Header>
                <Input as='div'>aaa</Input>
            </Segment>
        );
    }
}

export default Metronome;
import React, {Component} from 'react';
import { Button, Header, Input, Segment, Form, Icon, Label } from 'semantic-ui-react';
import ButtonGrid from './ButtonGrid.jsx';
import Tone from 'tone';


const NOTES = [
    {name: 'A', displayNames: ['A','A'], step: 0},
    {name: 'Bb', displayNames: ['B♭','A♯'], step: 1},
    {name: 'B', displayNames: ['B','B'], step: 2},
    {name: 'C', displayNames: ['C','C'], step: 3},
    {name: 'Db', displayNames: ['D♭','C♯'], step: 4},
    {name: 'D', displayNames: ['D','D'], step: 5},
    {name: 'Eb', displayNames: ['E♭','D♯'], step: 6},
    {name: 'E', displayNames: ['E','E'], step: 7},
    {name: 'F', displayNames: ['F','F'], step: 8},
    {name: 'Gb', displayNames: ['G♭','F♯'], step: 9},
    {name: 'G', displayNames: ['G','G'], step: 10},
    {name: 'Ab', displayNames: ['A♭','G♯'], step: 11},
];

const Waveforms = [
    {name: 'sine', displayName: 'Sine'},
    {name: 'triangle', displayName: 'Triangle'},
    {name: 'square', displayName: 'Square'},
    {name: 'sawtooth', displayName: 'Sawtooth'},
];

const MIN_OCTAVE = 2, MAX_OCTAVE = 6, OCTAVES = [2,3,4,5,6];

function arrayEqual(arr1, arr2)
{
    if (arr1.size !== arr2.size)
        return false;
    arr1.forEach(x => {
        arr2.forEach(y => {
            if (x !== y)
                return false;
        })
    });
    return true;
}

const polySynth = new Tone.PolySynth(OCTAVES.length*NOTES.length, Tone.Synth).toMaster();
polySynth.set({
    "envelope": {
        "attack": 0.1,
        "decay": 2,
        "sustain": 0.2,
        "release": 1,
    }, "oscillator": {
        "type": 'sine',
    }
});


class Tuner extends Component
{

    constructor()
    {
        super();

        this.state = {
            pitchCenter: 440,
            currentNoteNames: [],
            currentOctaves: [4],
            currentNoteDisplayTypeIndex: 0,
            waveform: 'sine',
        };

        this.flipNotation = this.flipNotation.bind(this);
        this.resetNoteNames = this.resetNoteNames.bind(this);
        this.toggleOctave = this.toggleOctave.bind(this);
        this.resetOctaves = this.resetOctaves.bind(this);
        this.setAllOctaves = this.setAllOctaves.bind(this);
        this.handleFrequencyInputChange = this.handleFrequencyInputChange.bind(this);
    }

    getNoteButtons(startIndex,endIndex)
    {
        let buttons = [];
        for (let i=startIndex; i<=endIndex; ++i)
        {
            buttons = [...buttons, this.getNoteButton(i)
            ];
        }
        return buttons;
    }

    getNoteButton(index)
    {
        let tuner = this;
        return (
            <Button className='noround'
                    key = {index}
                    active = {tuner.state.currentNoteNames.includes(NOTES[index])}
                    onClick = {() => this.toggleNoteName(NOTES[index])}
                    content = {NOTES[index].displayNames[this.state.currentNoteDisplayTypeIndex]}
                    toggle
            />);
    }

    generateNoteButtonColumns(rows=2,cols=6)
    {
        let groups = [];
        for (let col=0; col<cols; col+=1)
        {
            let buttons = [];
            for (let row=0; row<rows; ++row)
            {
                buttons = [...buttons, this.getNoteButton(col + cols*row)]
            }
            groups = [...groups,
                (
                    <Button.Group key={col} vertical>
                        {buttons}
                    </Button.Group>
                )
            ]
        }
        return groups;
    }

    flipNotation()
    {
        this.setState(
            {
                currentNoteDisplayTypeIndex: this.state.currentNoteDisplayTypeIndex === 1 ? 0 : 1,
            }
        );
    }

    toggleNoteName(noteName)
    {
        if (this.state.currentNoteNames.includes(noteName))
        {
            this.setState({
                    currentNoteNames: this.state.currentNoteNames.filter(
                        pitch => pitch !== noteName
                    )
            });
        }
        else
        {
            this.setState({
                currentNoteNames: [...this.state.currentNoteNames, noteName],
            });
        }
    }

    resetNoteNames()
    {
        this.setState({
            currentNoteNames: [],
        });
    }

    toggleOctave(octave)
    {
        if (this.state.currentOctaves.includes(octave))
        {
            this.setState({
                currentOctaves: this.state.currentOctaves.filter(
                    oct => oct !== octave
                )
            });
        }
        else
        {
            this.setState({
                currentOctaves: [...this.state.currentOctaves, octave],
            });
        }
    }

    resetOctaves()
    {
        this.setState({
            currentOctaves: [],
        });
    }

    setAllOctaves()
    {
        this.setState({
            currentOctaves: OCTAVES,
        });
    }

    handleFrequencyInputChange(event)
    {
        this.setState({
            pitchCenter: event.target.value,
        });
    }

    deltaFrequency(delta)
    {
        this.setState({
            pitchCenter: delta + Number(this.state.pitchCenter),
        });
    }

    setWaveform(type)
    {
        this.setState({
           waveform: type,
        });
    }

    getFrequencies(state)
    {
        let frequencies = [];
        state.currentNoteNames.forEach(note => {
            state.currentOctaves.forEach(octave => {
                frequencies = [...frequencies, (state.pitchCenter * Math.pow(2, octave-4 + note.step/12))]
            });
        });
        return frequencies;
    }

    render()
    {
        let octaveButtons = [];
        for (let octave = MIN_OCTAVE; octave <= MAX_OCTAVE; ++octave)
        {
            octaveButtons = [...octaveButtons, (
                <Button
                    content = {octave}
                    onClick = {() => this.toggleOctave(octave)}
                    key = {octave}
                    active = {this.state.currentOctaves.includes(octave)}
                    toggle
                />
            )]
        }
        return (
            <Segment className='widget'>
                <Header size='huge'>Tuner</Header>
                <Form>
                    <Form.Field>
                        <label>Pitch center</label>
                        <Input fluid type='number' placeholder='Hz' action size="huge" value={this.state.pitchCenter} onChange={this.handleFrequencyInputChange}
                        label="Hz" labelPosition="left corner">

                            <input className="pitch-center"/>
                            <Button type='submit' onClick={() => this.deltaFrequency(-10)}>-10</Button>
                            <Button type='submit' onClick={() => this.deltaFrequency(-1)}>-1</Button>
                            <Button type='submit' onClick={() => this.deltaFrequency(1)}>+1</Button>
                            <Button type='submit' onClick={() => this.deltaFrequency(10)}>+10</Button>

                        </Input>
                    </Form.Field>

                    <Form.Field>
                        <label>Pitches</label>
                        <ButtonGrid
                            rows = {
                                [
                                    this.getNoteButtons(0,5),
                                    this.getNoteButtons(6,11),
                                    [
                                        (<Button key='reset' onClick={this.resetNoteNames}>Reset</Button>),
                                        (<Button key='switch' onClick={this.flipNotation}>Rename</Button>)
                                    ]
                                ]
                            }
                        />

                    </Form.Field>
                    <Form.Field>
                        <label>Octave</label>
                        <ButtonGrid rows = {[
                            octaveButtons,
                            [
                                (<Button key='reset' onClick={this.resetOctaves}>Reset</Button>),
                                (<Button key='all' onClick={this.setAllOctaves}>All</Button>),
                            ]
                        ]}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Waveform</label>
                        <Button.Group fluid>
                            {Waveforms.map(waveform => (
                                <Button onClick={() => this.setWaveform(waveform.name)} toggle active={this.state.waveform === waveform.name}>{waveform.displayName}</Button>
                            ))}
                        </Button.Group>
                    </Form.Field>
                </Form>

            </Segment>

        )
    }



    componentDidUpdate(prevProps, prevState)
    {
        const newFreqs = this.getFrequencies(this.state);
        const oldFreqs = this.getFrequencies(prevState);
        console.log(newFreqs);
        if (this.state.waveform !== prevState.waveform)
        {
            polySynth.set({
                oscillator: {
                    type: this.state.waveform,
                }
            });
            polySynth.releaseAll();
            polySynth.triggerAttack(newFreqs);
        } else
        {
            oldFreqs.forEach(oldFreq=>{
                if (!newFreqs.includes(oldFreq))
                    polySynth.triggerRelease(oldFreq);
            });
            newFreqs.forEach(newFreq =>{
               if (!oldFreqs.includes(newFreq))
                   polySynth.triggerAttack(newFreq);
            });
        }
    }


}



export default Tuner;

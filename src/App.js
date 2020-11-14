import './App.css';
import React from 'react';
import PublicLogo from './noun_public.svg'
import PrivateLogo from './noun_private.svg'
import { find, get } from 'lodash';

export function Message(props) {
    const message = get(props.value, 'message', '')
    const status = get(props.value, 'status', '')
    let logo = status !== ''
        ? status === 'private'
            ? <img data-testid="img-element" src={PrivateLogo} alt="Private Logo" />
            : <img data-testid="img-element" src={PublicLogo} alt="Public Logo" />
        : null
    return (
        <div data-testid="message" className={`${status}-message`}>
            {logo}
            <div>{message}</div>
        </div>
    )
}

export function MessageList(props) {
    const messageList = props.messageList
    const list = Object.keys(messageList).map(_key => <Message key={_key} value={messageList[_key]} />)
    return (
        <div className='messageList'>
            <div>{list}</div>
        </div>
    )
}

export class MessageForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { text: '', status: 'public' }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this)
    }

    handleSubmit(e,message) {
        const status = this.state.status
        this.props.onAddNewMessage(message, status);
        this.setState({ text: '', status: 'public' })
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleOptionChange(e) {
        this.setState({ status: e.target.value })
    }

    render() {
        let value = this.state.text
        const status = this.state.status
        const text = this.state.text
        return (
            <form data-testid="form-wrapper" className="messageForm" onSubmit={(e) => this.handleSubmit(e, value)}>
                Write your message here:
                <textarea data-testid="text-area" className="text-area" value={value} onChange={this.handleChange} />
                <div>
                    <p>Select your message status</p>
                        <div>
                            <input
                                data-testid="input-radio-public"
                                type="radio"
                                id="public"
                                name="status"
                                value="public"
                                checked={status === 'public'}
                                onChange={this.handleOptionChange} />
                            <label htmlFor="public">Public</label>
                        </div>
                        <div>
                            <input
                                data-testid="input-radio-private"
                                type="radio"
                                id="private"
                                name="status"
                                value="private"
                                checked={status === 'private'}
                                onChange={this.handleOptionChange}/>
                            <label htmlFor="private">Private</label>
                        </div>
                    </div>
               <input data-testid="input-submit" type="submit" value="Send" disabled={!text} />
            </form>
        )
    }
}

export class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messageList: messageList,
            newMessage: '',
            ids: messageList.map(item => item.id)
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getId() {
        let randomId = Math.floor(Math.random() * 100000)
        if (find(this.state.ids, randomId)) this.getId()
        return randomId
    }

     handleSubmit(message, status) {
         let randomId = this.getId()

         let list = this.state.messageList
         list.unshift({ id: randomId, status: status, message: message })

         this.setState({ newMessage: '', messageList: list })
    }

    render() {
        const newMessage = this.state.newMessage
        return (
            <div className="App">
                <MessageList messageList={this.state.messageList}/>
                <MessageForm newMessage={newMessage} onAddNewMessage={this.handleSubmit}/>
            </div>
        )
    }
}

const messageList = [
     {
        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
        status: 'private',
        id: 54
    }, {
        message:'Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
        status: 'public',
        id: 3
    }, {
        message:'Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.',
        status: 'public',
        id: 89
    },  {
        message:'Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.',
        status: 'private',
        id: 4,
    }, {
        message:'Pellentesque congue.',
        status: 'private',
        id: 98,
    }, {
        message:'Ut in risus volutpat libero pharetra tempor.',
        status: 'public',
        id: 48,
    }, {
        message:'Cras vestibulum bibendum augue.',
        status: 'private',
        id: 21,
    }, {
        message:'Praesent egestas leo in pede.',
        status: 'private',
        id: 18,
    },  {
        message:'Praesent blandit odio eu enim.',
        status:'public',
        id:23,
    }, {
        message:'Pellentesque sed dui ut augue blandit sodales.',
        status:'private',
        id:73
    }
]


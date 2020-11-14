import { render, screen, fireEvent } from '@testing-library/react';
import { MessageList, Message, MessageForm } from './App';

import { unmountComponentAtNode } from 'react-dom';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// I'm not testing App component because it renders MessageForm & MessageList that
// are already being tested

//- MessageForm tests
describe('renders message form', () => {
    test('form DOM elements', () => {
        render(<MessageForm />);

        expect(screen.getByText('Write your message here:')).toBeInTheDocument();
        expect(screen.getByText('Select your message status')).toBeInTheDocument();
        expect(screen.getByText('Write your message here:')).toBeInTheDocument();

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(2);
        expect(screen.getByRole('button')).toBeInTheDocument();

    })

    test('text-area element', () => {
        render(<MessageForm />);
        const _textArea = screen.getByTestId('text-area');
        const _submit = screen.getByTestId('input-submit');

        expect(_textArea).toHaveClass('text-area');

        //when text-area is empty => button disabled
        expect(_submit).toBeDisabled()

        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'writing some tests...' },
        });

        expect(screen.getByText('writing some tests...')).toBeInTheDocument();
        expect(_submit).toBeEnabled()
    })

    test('submit element', () => {
        const onSubmit = jest.fn();
        render(<MessageForm onAddNewMessage={onSubmit}/>);
        const button = screen.getByRole('button')

        expect(button).toHaveAttribute('disabled');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).not.toHaveAttribute('type', 'button')

        fireEvent.submit(screen.getByRole('button'), {
            target: { value: 'Send' },
        });

        expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    test('radio element', () => {
        const { getByLabelText }  = render(<MessageForm />);

        const _publicRadioButton = getByLabelText('Public')
        const _privateRadioButton = getByLabelText('Private')

        expect(_publicRadioButton).toBeChecked();
        expect(_privateRadioButton).not.toBeChecked();

        fireEvent.click(_privateRadioButton)

        expect(_publicRadioButton).not.toBeChecked();
        expect(_privateRadioButton).toBeChecked();

    })
})

//- MessageList tests
test('renders message list', () => {
    render(<MessageList messageList={messageList} />)

    expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.')).toBeInTheDocument();
    expect(screen.getByText('Ut in risus volutpat libero pharetra tempor.')).toBeInTheDocument();
    expect(screen.getByText('Cras vestibulum bibendum augue.')).toBeInTheDocument();
    expect(screen.getByText('Praesent egestas leo in pede.')).toBeInTheDocument();
    expect(screen.getByText('Praesent blandit odio eu enim.')).toBeInTheDocument();

})

//- Message tests
describe('renders public message', () => {
    test('empty list', () => {
        render(<Message value={{}} />);
        expect(screen.queryByText('Praesent blandit odio eu enim.')).toBeNull();
        expect(screen.queryByAltText('Public Logo')).toBeNull();
    })

    test('text', () => {
        render(<Message value={messageList[4]} />);
        const _message = screen.getByTestId('message');

        expect(screen.getByText('Praesent blandit odio eu enim.')).toBeInTheDocument();
        expect(_message).toHaveClass('public-message');
    });


    test('logo', () => {
        render(<Message value={messageList[4]} />);
        const _logo = screen.getByTestId('img-element');

        expect(screen.getByAltText('Public Logo')).toBeInTheDocument();
        expect(_logo).toBeInTheDocument();
    });
})


describe('renders private message', () => {
    test('empty list', () => {
        render(<Message value={{}} />);
        expect(screen.queryByText('Cras vestibulum bibendum augue.')).toBeNull();
        expect(screen.queryByAltText('Private Logo')).toBeNull();
    })

    test('text', () => {
        render(<Message value={messageList[0]} />)
        const _message = screen.getByTestId('message');

        expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.')).toBeInTheDocument();
        expect(_message).toHaveClass('private-message');
    });


    test('logo', () => {
        render(<Message value={messageList[0]} />)
        const _logo = screen.getByTestId('img-element');

        expect(screen.getByAltText('Private Logo')).toBeInTheDocument();
        expect(_logo).toBeInTheDocument();
    });
});

const messageList = [
     {
        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
        status: 'private',
        id: 54
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
    }
]
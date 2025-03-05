import '@testing-library/jest-dom'
import { fireEvent, render, screen } from "@testing-library/react"
import { Dashboard } from "../components/Dashboard"
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthContext } from '../App';
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function renderDashboard() {
    render(<Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>);
}

function renderGuestDashboard() {
    render(<AuthContext.Provider value={{isAuthenticated: false, role: 'guest', login: jest.fn(), register: jest.fn(), logout: jest.fn()}}>
        <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>
    </AuthContext.Provider>);
}

function testDisabledTable(table: string) {
    renderGuestDashboard();
    const tableButton = screen.queryAllByRole('button', {name: table});
    expect(tableButton).not.toBeNull();
    expect(screen.queryByText(/You are a guest. Please/)).toBeNull();
    let signInButton = screen.queryByText('sign in');
    expect(signInButton).toBeNull();
    expect(screen.queryByText(/as a user to view the table./)).toBeNull();
    // Clicking should render a table of users
    fireEvent.click(tableButton[0]);
    signInButton = screen.queryByText('sign in');
    expect(screen.queryByText(/You are a guest. Please/)).not.toBeNull();
    expect(signInButton).not.toBeNull()
    expect(screen.queryByText(/as a user to view the table./)).not.toBeNull();
    jest.clearAllMocks();
    if (signInButton) {
        fireEvent.click(signInButton);
        expect(mockUseNavigate).toHaveBeenCalledWith('/login');
    } else fail('Invalid authentication form type');
}

describe('When rendering the dashboard', () => {
    it('displays appropriate text', () => {
        renderDashboard();
        expect(screen.getByText('Theoforge')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Select a section from the sidebar to get started.')).toBeInTheDocument();
    });
    it('displays the theoforge logo', () => {
        renderDashboard();
        const logo = screen.queryByRole('img');
        expect(logo).toHaveAttribute('src', '/logo.png')
    });
    it('contains a users list button', () => {
        renderDashboard();
        const usersButton = screen.queryAllByRole('button', {name: 'Users'});
        expect(usersButton).not.toBeNull();
        expect(screen.queryByText('Users list')).toBeNull();
        // Clicking should render a table of users
        fireEvent.click(usersButton[0]);
        expect(screen.queryByText('Users list')).not.toBeNull();
        expect(screen.queryByText('See information about all users')).not.toBeNull();
        const searchForm = screen.getByText('Search');
        expect(searchForm).toBeDefined();
        const table = screen.queryByRole('table');
        expect(table).not.toBeNull();
        const tableColumns = screen.queryAllByRole('columnheader');
        const expectedColumns = ['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'];
        expect(tableColumns).toHaveLength(6);
        for(let i = 0; i < tableColumns.length;i ++) {
            expect(tableColumns[i]).toHaveTextContent(expectedColumns[i]);
        }
        const pagination = screen.queryByText(/Page [0-9]+ of [0-9]+/);
        expect(pagination).not.toBeNull();
        const prevPageButton = screen.queryByRole('button', {name: 'Previous'});
        const nextPageButton = screen.queryByRole('button', {name: 'Next'});
        expect(prevPageButton).not.toBeNull();
        expect(nextPageButton).not.toBeNull();
    });
    it('contains a guests list button', () => {
        renderDashboard();
        const guestsButton = screen.queryAllByRole('button', {name: 'Guests'});
        expect(guestsButton).not.toBeNull();
        expect(screen.queryByText('Guests list')).toBeNull();
        // Clicking should render a table of guests
        fireEvent.click(guestsButton[0]);
        expect(screen.queryByText('Guests list')).not.toBeNull();
        expect(screen.queryByText('See information about all guests')).not.toBeNull();
        const searchForm = screen.getByText('Search');
        expect(searchForm).toBeDefined();
        const table = screen.queryByRole('table');
        expect(table).not.toBeNull();
        const tableColumns = screen.queryAllByRole('columnheader');
        const expectedColumns = ['Name', 'Company', 'Industry', 'Project', 'Contact', 'Status', 'Last Interaction', 'Actions'];
        expect(tableColumns).toHaveLength(8);
        for(let i = 0; i < tableColumns.length;i ++) {
            expect(tableColumns[i]).toHaveTextContent(expectedColumns[i]);
        }
        const pagination = screen.queryByText(/Page [0-9]+ of [0-9]+/);
        expect(pagination).not.toBeNull();
        const prevPageButton = screen.queryByRole('button', {name: 'Previous'});
        const nextPageButton = screen.queryByRole('button', {name: 'Next'});
        expect(prevPageButton).not.toBeNull();
        expect(nextPageButton).not.toBeNull();
    });
    it('contains a marketplace button', () => {
        renderDashboard();
        const marketplaceButton = screen.queryAllByRole('button', {name: 'Marketplace'});
        expect(marketplaceButton).not.toBeNull();
        expect(screen.queryAllByText('Marketplace')).toHaveLength(2);
        // Clicking should render the marketplace
        fireEvent.click(marketplaceButton[0]);
        expect(screen.queryAllByText('Marketplace')).toHaveLength(3);
    });
});

describe('When rendering the dashboard as a guest', () => {
    it('displays appropriate text', () => {
        renderGuestDashboard();
        expect(screen.getByText('Theoforge')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Select a section from the sidebar to get started.')).toBeInTheDocument();
    });
    it('displays the theoforge logo', () => {
        renderGuestDashboard();
        const logo = screen.queryByRole('img');
        expect(logo).toHaveAttribute('src', '/logo.png')
    });
    it('contains a users list button', () => {
        // the table should be disabled for guests
        testDisabledTable('Users');
    });
    it('contains a guests list button', () => {
        // the table should be disabled for guests
       testDisabledTable('Guests');
    });
    it('contains a marketplace button', () => {
        renderDashboard();
        const marketplaceButton = screen.queryAllByRole('button', {name: 'Marketplace'});
        expect(marketplaceButton).not.toBeNull();
        expect(screen.queryAllByText('Marketplace')).toHaveLength(2);
        // Clicking should render the marketplace
        fireEvent.click(marketplaceButton[0]);
        expect(screen.queryAllByText('Marketplace')).toHaveLength(3);
    });
});
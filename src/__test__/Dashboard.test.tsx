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

function renderAdminDashboard() {
    render(<AuthContext.Provider value={{isAuthenticated: false, role: 'ADMIN', login: jest.fn(), register: jest.fn(), logout: jest.fn()}}>
    <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>
</AuthContext.Provider>);
}

function renderUserDashboard() {
    render(<AuthContext.Provider value={{isAuthenticated: false, role: 'USER', login: jest.fn(), register: jest.fn(), logout: jest.fn()}}>
        <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>
    </AuthContext.Provider>);
}

describe('When rendering the dashboard as an admin', () => {
    it('displays appropriate text', () => {
        renderAdminDashboard();
        expect(screen.getByText('Theoforge')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Select a section from the sidebar to get started.')).toBeInTheDocument();
    });
    it('displays the theoforge logo', () => {
        renderAdminDashboard();
        const logo = screen.queryByRole('img');
        expect(logo).toHaveAttribute('src', '/logo.png')
    });
    it('contains a users list button', () => {
        renderAdminDashboard();
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
        renderAdminDashboard();
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
        renderAdminDashboard();
        const marketplaceButton = screen.queryAllByRole('button', {name: 'Marketplace'});
        expect(marketplaceButton).not.toBeNull();
        // There are 2 buttons: one for the collapsed and uncollapsed sidebar
        expect(screen.queryAllByText('Marketplace')).toHaveLength(2);
        // Clicking should render the marketplace
        fireEvent.click(marketplaceButton[0]);
        expect(screen.queryAllByText('Marketplace')).toHaveLength(3);
    });
});

describe('When rendering the dashboard as a user', () => {
    it('displays appropriate text', () => {
        renderUserDashboard();
        expect(screen.getByText('Theoforge')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Select a section from the sidebar to get started.')).toBeInTheDocument();
    });
    it('displays the theoforge logo', () => {
        renderUserDashboard();
        const logo = screen.queryByRole('img');
        expect(logo).toHaveAttribute('src', '/logo.png')
    });
    it('does not contains a users list or guest button', () => {
        expect(screen.queryByRole('button', {name: 'Users'})).toBeNull();
        expect(screen.queryByRole('button', {name: 'Guests'})).toBeNull();
    });
    it('contains a marketplace button', () => {
        renderUserDashboard();
        const marketplaceButton = screen.queryAllByRole('button', {name: 'Marketplace'});
        expect(marketplaceButton).not.toBeNull();
        // There are 2 buttons: one for the collapsed and uncollapsed sidebar
        expect(screen.queryAllByText('Marketplace')).toHaveLength(2);
        // Clicking should render the marketplace
        fireEvent.click(marketplaceButton[0]);
        expect(screen.queryAllByText('Marketplace')).toHaveLength(3);
    });
});
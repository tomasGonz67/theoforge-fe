import '@testing-library/jest-dom'
import { fireEvent, render, screen } from "@testing-library/react"
import { Dashboard } from "../components/Dashboard"
import { BrowserRouter as Router } from 'react-router-dom'
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));
function renderDashboard() {
    render(<Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>);
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
        // Clicking should render a table of guests
        fireEvent.click(marketplaceButton[0]);
        expect(screen.queryAllByText('Marketplace')).toHaveLength(3);
    });
});
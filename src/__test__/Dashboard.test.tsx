import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Dashboard } from "../components/Dashboard"
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthContext } from '../App';
import axios from 'axios';
jest.mock('axios');
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function renderAdminDashboard() {
    render(<AuthContext.Provider value={{isAuthenticated: false, accessToken: null, role: 'ADMIN', login: jest.fn(), register: jest.fn(), logout: jest.fn()}}>
    <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>
</AuthContext.Provider>);
}

function renderUserDashboard() {
    render(<AuthContext.Provider value={{isAuthenticated: false, accessToken: null, role: 'USER', login: jest.fn(), register: jest.fn(), logout: jest.fn()}}>
        <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}><Dashboard></Dashboard></Router>
    </AuthContext.Provider>);
}

describe('When rendering the dashboard as an admin', () => {
    it('displays appropriate text', () => {
        renderAdminDashboard();
        // Theoforge text for collapsed sidebar, expanded sidebar, small screen size
        expect(screen.getAllByText('Theoforge')).toHaveLength(3);
        expect(screen.getByText(/Welcome back, .+/)).toBeInTheDocument();
        expect(screen.getByText("Here's what's happening with your projects today.")).toBeInTheDocument();
    });
    it('displays the appropriate images', () => {
        renderAdminDashboard();
        const images = screen.queryAllByRole('img');
        expect(images).toHaveLength(4);
        // Theoforge logo for collapsed sidebar, expanded sidebar, and small screen size
        expect(images[0]).toHaveAttribute('src', '/logo.png')
        expect(images[2]).toHaveAttribute('src', '/logo.png')
        expect(images[3]).toHaveAttribute('src', '/logo.png')
        // User profile pic
        expect(images[1]).toHaveAttribute('src', '/api/placeholder/40/40')
    });
    it('contains a users list button', () => {
        renderAdminDashboard();
        const usersButtonText = screen.queryAllByText('Users');
        // A users button for collapsed and uncollapsed sidebar
        expect(usersButtonText).toHaveLength(2);
        const usersButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Users'));
        expect(screen.queryByText('Users list')).toBeNull();
        // Clicking should render a table of users
        if(usersButton) fireEvent.click(usersButton);
        else fail('No users button found');
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
    it('contains a guests list button', async () => {
        renderAdminDashboard();
        const guestsButtonText = screen.queryAllByText('Guests');
        // A guests button for collapsed and uncollapsed sidebar
        expect(guestsButtonText).toHaveLength(2);
        const guestsButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Guests'));
        expect(screen.queryByText('Guests list')).toBeNull();
        // Clicking should render a table of guests
        if(guestsButton) fireEvent.click(guestsButton);
        else fail('No guests button found');
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Guests list')).not.toBeNull();
            expect(screen.queryByText('See information about all guests')).not.toBeNull();
            const searchForm = screen.getByText('Search');
            expect(searchForm).toBeDefined();
            const table = screen.queryByRole('table');
            expect(table).not.toBeNull();
            const tableColumns = screen.queryAllByRole('columnheader');
            const expectedColumns = ["Name", "Company", "Industry", "Budget", "Contact", "Status", "Last Interaction", "Actions"];
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
    });
    it('contains a marketplace button', () => {
        renderAdminDashboard();
        const marketplaceButtonText = screen.queryAllByText('Marketplace');
        // A marketplace button for collapsed and uncollapsed sidebar and dashboard card
        expect(marketplaceButtonText).toHaveLength(3);
        const marketplaceButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Marketplace'));
        expect(screen.queryByText('AI Solution Marketplace')).toBeNull();
        // Clicking should render the marketplace
        if(marketplaceButton) fireEvent.click(marketplaceButton);
        else fail('No guests button found');
        expect(screen.queryByText('AI Solution Marketplace')).not.toBeNull();
    });
});

describe('When rendering the dashboard as a user', () => {
    it('displays appropriate text', () => {
        renderUserDashboard();
        // Theoforge text for collapsed sidebar, expanded sidebar, small screen size
        expect(screen.getAllByText('Theoforge')).toHaveLength(3);
        expect(screen.getByText('Welcome to Theoforge')).toBeInTheDocument();
        expect(screen.getByText("Access your AI services and explore new capabilities for your business")).toBeInTheDocument();
    });
    it('displays the appropriate images', () => {
        renderUserDashboard();
        const images = screen.queryAllByRole('img');
        expect(images).toHaveLength(4);
        // Theoforge logo for collapsed sidebar, expanded sidebar, and small screen size
        expect(images[0]).toHaveAttribute('src', '/logo.png')
        expect(images[2]).toHaveAttribute('src', '/logo.png')
        expect(images[3]).toHaveAttribute('src', '/logo.png')
        // User profile pic
        expect(images[1]).toHaveAttribute('src', '/api/placeholder/40/40')
    });
    it('does not contains a users list or guest button', () => {
        renderUserDashboard();
        const usersButtonText = screen.queryAllByText('Users');
        expect(usersButtonText).toHaveLength(0);
        const usersButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Users'));
        expect(usersButton).toBeUndefined();
        const guestsButtonText = screen.queryAllByText('Guests');
        expect(guestsButtonText).toHaveLength(0);
        const guestsButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Guests'));
        expect(guestsButton).toBeUndefined();
    });
    it('contains a marketplace button', () => {
        renderUserDashboard();
        const marketplaceButtonText = screen.queryAllByText('Marketplace');
        // A marketplace button for collapsed and uncollapsed sidebar
        expect(marketplaceButtonText).toHaveLength(2);
        const marketplaceButton = screen.getAllByRole('button').find(div => div.innerHTML.includes('Marketplace'));
        expect(screen.queryByText('AI Solution Marketplace')).toBeNull();
        // Clicking should render the marketplace
        if(marketplaceButton) fireEvent.click(marketplaceButton);
        else fail('No guests button found');
        expect(screen.queryByText('AI Solution Marketplace')).not.toBeNull();
    });
});
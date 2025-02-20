import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { routes } from '../routes';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { MOVIE_DATA, MOVIE_DATA_ARRAY, PROVIDER_DATA, TV_DATA, TV_DATA_ARRAY } from './assets';

// mock MovieDB API calls
vi.doMock('../../helpers/getMovieUtils', () => {
    return {
        default: {},
        getMoviesByName: vi.fn().mockResolvedValue(MOVIE_DATA_ARRAY),
        getMovieDetails: vi.fn().mockResolvedValue(MOVIE_DATA),
        getMovieProviders: vi.fn().mockResolvedValue(PROVIDER_DATA),
        getMovieRecommendations: vi.fn().mockResolvedValue(MOVIE_DATA_ARRAY),
    };
});

vi.doMock('../../helpers/getTvUtils', () => {
    return {
        default: {},
        getTvByName: vi.fn().mockResolvedValue(TV_DATA_ARRAY),
        getTvDetails: vi.fn().mockResolvedValue(TV_DATA),
        getTvProviders: vi.fn().mockResolvedValue(PROVIDER_DATA),
        getTvRecommendations: vi.fn().mockResolvedValue(TV_DATA_ARRAY),
    };
});

// TODO: #427 Re-enable tests when UI stable
describe.skip('Movie Screen Test Suite', async () => {
    // set up variables to be used on each test
    let user: UserEvent;
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('renders search results page when search button clicked with input', async () => {
        // create a new data router for the test
        const router = createMemoryRouter(routes, {
            initialEntries: ['/'],
        });
        // render screens
        render(<RouterProvider router={router} />);

        await waitFor(() => screen.getByTestId('featured-search-heading'));
        const searchButtons = screen.getAllByTestId('search-button');
        // check for the first button
        expect(searchButtons[0]).toBeInTheDocument();
        const searchInputs = screen.getAllByTestId('search-input');
        // select the first input, add 'Iron Man'
        await user.type(searchInputs[0], 'Iron Man');
        expect(searchInputs[0]).toHaveValue('Iron Man');
        // click on search button to change screens
        await user.click(searchButtons[0]);
        await waitFor(() => screen.getByTestId('search-results-heading'));
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Search Results Page');
        // check for show card
        expect(screen.getAllByRole('heading')[1]).toHaveTextContent('Iron Man');
    });
    it('does not render search results when search button is clicked with no input', async () => {
        // create a new data router for the test
        const router = createMemoryRouter(routes, {
            initialEntries: ['/'],
        });
        // render screens
        render(<RouterProvider router={router} />);

        await waitFor(() => screen.getByTestId('featured-search-heading'));
        const searchButtons = screen.getAllByTestId('search-button');
        expect(searchButtons[0]).toBeInTheDocument();
        await user.click(searchButtons[0]);
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Featured Search Page');
    });
    it('renders show details screen when show card is clicked on', async () => {
        // create a new data router for the test
        const router = createMemoryRouter(routes, {
            initialEntries: ['/search?q=iron+man'],
        });
        // render screens
        render(<RouterProvider router={router} />);

        await waitFor(() => screen.getByTestId('search-results-heading'));
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Search Results Page');
        // click on show card to change screen
        await user.click(screen.getAllByTestId('show-details-link')[0]);
        await waitFor(() => screen.getByTestId('show-details-heading'));
        await waitFor(() => screen.getByAltText('Disney Plus logo'));
        const image: HTMLImageElement = screen.getByAltText('Disney Plus logo');
        expect(image).toBeInTheDocument();
        expect(image.src).toBe('https://image.tmdb.org/t/p/w500/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg');
        expect(screen.getByTestId('details-release-date')).toBeInTheDocument();
        expect(screen.getByTestId('details-release-date')).toHaveTextContent('April 30th, 2008');
    });
});

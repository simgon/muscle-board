import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

it('renders Muscle Board', () => {
  render(<Header />);
  const element = screen.getByText('Muscle Board');
  expect(element).toBeInTheDocument();
});

it('renders link', () => {
  render(<Header />);
  const linkElement = screen.getByRole('link', { href: '/' });
  //screen.debug(linkElement);
  expect(linkElement).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react'
import { ThemedText } from '../ThemedText';

describe('App', () => {
  it('renders the App component', () => {
    render(<ThemedText />)
    
    screen.debug();
  })
})
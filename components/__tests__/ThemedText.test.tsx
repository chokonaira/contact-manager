import { render, screen } from '@testing-library/react'
import { ThemedText } from '../ThemedText';
import {  describe,  it } from 'vitest'

describe('App', () => {
  it('renders the App component', () => {
    render(<ThemedText />)
    
    screen.debug();
  })
})
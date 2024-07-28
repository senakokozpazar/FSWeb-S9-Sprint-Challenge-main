import {
  render,
  screen,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AppFunctional from "./AppFunctional"
import React from 'react';
 
beforeEach(() => {
  render(<AppFunctional />);
});

test('[1] hata olmadan render ediliyor', () => {
  render(<AppFunctional />);
});

test('[2] başlangıç koordinatı ekranda doğru render ediliyor', () => {
  const initialKoordinat = screen.getByText(/Koordinatlar \(2, 2\)/i); //ters slash kaçış ifadesi.
  expect(initialKoordinat).toBeInTheDocument();
  expect(initialKoordinat).toHaveTextContent('Koordinatlar (2, 2)');
});

test('[3] bir adım sağa gidince koordinatlar ekranda doğru render ediliyor', async()=> {
  const initialKoordinat = screen.getByText(/Koordinatlar \(2, 2\)/i); 
  expect(initialKoordinat).toBeInTheDocument();

  const buttonRight = screen.getByText(/sağ/i);
  userEvent.click(buttonRight);

  await waitFor(()=>{
    const newKoordinat = screen.getByText(/Koordinatlar \(3, 2\)/i);
    expect(newKoordinat).toBeInTheDocument();
    expect(newKoordinat).toHaveTextContent('Koordinatlar (3, 2)');
  }) 
});

test('[4] sola gidemezsiniz mesajı ekranda render ediliyor', async () => {

  const initialKoordinat = screen.getByText(/Koordinatlar \(2, 2\)/i);
  expect(initialKoordinat).toBeInTheDocument();

  const buttonLeft = screen.getByText(/sol/i);
  userEvent.click(buttonLeft);

  await waitFor(() => {
    const newKoordinat = screen.getByText(/Koordinatlar \(1, 2\)/i);
    expect(newKoordinat).toBeInTheDocument();
    expect(newKoordinat).toHaveTextContent('Koordinatlar (1, 2)');
  });

  userEvent.click(buttonLeft);

  await waitFor(() => {
    const errorMessage = screen.getByText(/Sola gidemezsiniz/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

test('[5] mail adresi yazınca email alanının değeri değişiyor', async () => {
  const emailInput = screen.getByPlaceholderText(/email girin/i);
  expect(emailInput).toBeInTheDocument();

  await userEvent.type(emailInput, 'lady@gaga.com');
  expect(emailInput).toHaveValue('lady@gaga.com')
})
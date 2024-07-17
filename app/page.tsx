'use client'

import Image from "next/image";
import styles from "./page.module.css";
import styled, { keyframes } from "styled-components";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";
import { differenceInMilliseconds } from "date-fns";

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
`

const fadeInStatic = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 20%;
  flex-direction: column;

  animation: ${fadeIn} 1.75s ease-in-out;
`

const LogoContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin-top: 1%;
  margin-left: 1%;
  flex-direction: row;
  animation: ${fadeInStatic} 1.75s ease-in-out;
`

const Title = styled.text`
  color: black;
  font-size: 60px;
  font-family: inherit;
`

const SubTitle = styled.text`
  color: black;
  font-size: 24px;
  font-family: inherit;
`

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  flex-direction: column;
  animation: ${fadeInStatic} 2s ease-in-out;
`

const Text = styled.text`
  color: #000;
  font-family: inherit;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
` 

const Input = styled.input<{valid: boolean}>`
  width: 400px;
  font-size: 100px;
  text-align: center;
  margin-top: 20px;
  border: none;
  border-bottom: 1px solid black;
  border-bottom: 1px solid ${(props) => props.valid ? '#000' : '#A85100'};
  color: ${(props) => props.valid ? '#000' : '#A85100'};
  margin-top: 5%;

  transition: all 1s ease-in-out;
`

const ContainerNumber = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  flex-direction: column;
  animation: ${fadeInStatic} 2s ease-in-out;
`

const Button = styled.button<{color: string, bgColor: string, hoverColor: string, hoverBg: string}>`
  width: 280px;
  height: 109px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${(props) => props.bgColor};

  color: ${(props) => props.color};
  font-family: inherit;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  
  margin-top: 10%;
  cursor: pointer;

  transition: all 500ms ease;

  &:hover {
    background: ${(props) => props.hoverBg};
    color: ${(props) => props.hoverColor};
  }
`

const About = styled.div`
  margin-left: 100px;

  h1 {
    color: #000;
    font-family: inherit;
    font-size: 84px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }

  h2 {
    color: var(--error-color);
    font-family: inherit;
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: -60px;
  }

  h3 {
    color: #000;
    font-family: inherit;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 50px;
    margin-bottom: 42px;
  }

  text {

    color: #000;
    font-family: inherit;
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 10px;
    display: flex;
    flex: 1;
    align-items: baseline;

    span {
      color: var(--error-color);
      font-size: 20px;
      margin-left: 10px;
    }
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  max-height: 200px;
  flex: 1;
  justify-content: flex-end;
  margin-right: 20px;
  gap: 20px;
  border: none;
  margin-top: -8%;
`

export default function Home() {

  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState(true)
  const [getInfo, setInfo] = useState<any>({})

  const [state, setState] = useState<'loading' | 'home' | 'painel' | ''>('')

  useEffect(() => {
    setTimeout(() => {
      setState('loading')
    }, 500);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setState('home')
    }, 2000);
  }, [])

  if (state === '') {
    return;
  }

  if (state === 'loading') {
    return (
    <LoadingContainer>
      <Logo/>
      <Title>EVO</Title>
      <SubTitle>Conecte-se, Reúna-se</SubTitle>
    </LoadingContainer>
    )
  }

  if (state === 'painel') {

    return(
      <>
        <LogoContainer>
          <Logo/>
          <Title>EVO</Title>
        </LogoContainer>
        <About>
          <h3>Reunião de:</h3>
          <h1>{getInfo.author}</h1>
          <h2>{getInfo.time}</h2>
          <h3>Presenças:</h3>

          {getInfo.presencas.slice(0, 5).map((element: any) => {
            return(
              <text key={element.id}>{element.name}<span>{element.atArrived}</span></text>
            )
          })}

          <text>+ {getInfo.presencas.length - 5} pessoas</text>
        </About>
      </>
    )
  }


  return (
    <>
      <LogoContainer>
        <Logo/>
        <Title>EVO</Title>
      </LogoContainer>
    </>
  );
}

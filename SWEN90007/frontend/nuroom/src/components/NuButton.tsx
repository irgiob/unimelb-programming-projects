import styled from "styled-components"


export default function NuButton(props: any){
  return (
    <Container color={props.color} bgColor={props.bgColor} >
      <TextItem color={props.color} bgColor={props.bgColor}>{props.text}</TextItem>
    </Container>
  )
}
interface Props {
  bgColor: string
  color: string
}
const Container = styled.div<Props>` 
  padding:8px; 

  border-radius: 10px;
  &:hover{
    cursor: pointer;
    background-color: ${(props: Props)=> props.bgColor};
  }
  
`
const TextItem = styled.div<Props>`
  color: ${(props: Props)=> props.color};
  font-size: 15px;
`
import { useState } from "react"
interface ContainerProps{
  nome:string
}
function Container(props: ContainerProps) {
  const [texto, setTexto] = useState('');

  function trataInput(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.currentTarget.value)
    setTexto(event.currentTarget.value)
  }

  return (
    <>
      <h1>{props.nome}</h1>
      <div>
        Texto: {texto}
      </div>
      <input type="text" placeholder="Mostrar Texto" onChange={trataInput} />
    </>
  )
}
export default Container
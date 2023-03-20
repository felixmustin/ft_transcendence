import React from 'react'

type Props = {
  item: {
    field: string;
    placeholder: string;
  }
}

const SettingField = (props: Props) => {
  return (
    <div>
      <h2 className='text-white text-2xl'>{ props.item.field }</h2>
      <input className='bg-violet-900 text-white rounded-lg hover:bg-gradient-to-tl from-violet-900 via-slate-900 to-violet-900 shadow-lg shadow-slate-900/30 hover:shadow-violet-900/40 p-2 m-2' type='text' placeholder={ props.item.placeholder }/>
    </div>
  )
}

export default SettingField
import React from 'react'

type Props = {
  item: {
    field: string;
    data: number | undefined;
  };
}

const UserProfileData = (props: Props) => {
  return (
    <div className='bg-gray-900 rounded-lg grid grid-cols-2 gap-4 content-center text-white text-center mx-5 my-3'>
      <h1>{ props.item.field } :</h1>
      <h1>{ props.item.data }</h1>
    </div>
  )
}

export default UserProfileData
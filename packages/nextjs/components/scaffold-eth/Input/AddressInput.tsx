import { useCallback } from 'react'
import Blockies from 'react-blockies'
import { Address } from 'viem'
import { CommonInputProps, InputBase } from '~~/components/scaffold-eth'

/**
 * Address input
 */
export const AddressInput = ({ value, name, placeholder, onChange, disabled }: CommonInputProps<Address | string>) => {
  const handleChange = useCallback(
    (newValue: Address) => {
      onChange(newValue)
    },
    [onChange]
  )

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      // error={ensAddress === null}
      value={`0x${value}`}
      onChange={handleChange}
      disabled={disabled}
      suffix={value && <Blockies className="!rounded-full" seed={value?.toLowerCase() as string} size={7} scale={5} />}
    />
  )
}

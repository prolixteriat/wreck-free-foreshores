
// -----------------------------------------------------------------------------

interface ICloseButtonProps {
  onClose: () => void;
}

export function CloseButton( { onClose }: ICloseButtonProps): React.JSX.Element {
  
  return (
    <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
      onClick={ () => onClose() }
    >✕</button>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

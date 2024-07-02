
// -----------------------------------------------------------------------------

interface ILoadingProps {
    centre?: boolean;
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------    

export const Loading = ({ centre = false }: ILoadingProps): React.JSX.Element => {
    
    const justify = centre ? 'justify-center' : 'justify-normal';
    
    return (
        <div className={`flex ${justify}`}>
            <span className='loading loading-bars loading-lg'></span>
        </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

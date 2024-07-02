
// -----------------------------------------------------------------------------

interface ISubTableProps {
    title: string;
    items: string[];
  }
  
  // -----------------------------------------------------------------------------
  
  export function SubTable(props: ISubTableProps): React.JSX.Element {
      
    const { title, items } = props;

      return ( 
        <>
        <b>{title}</b>
        {!items || items.length === 0 ? (
                <p>No hazards reported</p>
            ) : (
                <ul className="list-disc pl-5">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}

        </>

      );
  }
  // -----------------------------------------------------------------------------
  // End
  // -----------------------------------------------------------------------------

  
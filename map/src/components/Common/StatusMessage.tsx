import { topStyle } from '@lib/global';
import { IApiStatus } from '@lib/poster';

// -----------------------------------------------------------------------------

interface IStatusMessage {
    status: IApiStatus;
    onClose: () => void;
}
// -----------------------------------------------------------------------------

export function StatusMessage(props: IStatusMessage): React.JSX.Element {
    const { status, onClose } = props;  
    
    return (
      <div style={topStyle}>
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-md'>
          <p><b>Status</b>: {(status.success) ? 'Success' : 'Failed'}</p>
          <p><b>Message</b>: {status.message}</p>
          <button
              onClick={onClose} 
              className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

import { useContext, useState } from 'react';

import { WrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';
import { IApiStatus } from '@lib/poster';

import { Loading, MessageBar, StatusMessage } from '@components/Common';
import { TTabSelectCallback } from '@components/Tabs/makeTabs';

import { FormButton } from './common';
import { Errors, IFormData, initFormData, validateForm } from './funcs';
import { addWreck } from './callapi.ts';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3 } from './Section3';
import { Section4 } from './Section4';
import { Section5 } from './Section5';

// -----------------------------------------------------------------------------

interface INotificationFormProps {
  onSelect: TTabSelectCallback;
}

export default function NotificationForm(props: INotificationFormProps): React.JSX.Element {

  const { onSelect } = props;

  const [formData, setFormData] = useState<IFormData>(initFormData());
  const [errors, setErrors] = useState<Errors>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [status, setStatus] = useState<IApiStatus|null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const context = useContext(WrecksContext);
  
  const numSections = 5;

  const handleNext = () => {
    const valid = validateForm(formData, currentSection, setErrors);
    setDialogOpen(!valid);
    if (valid) {
      setCurrentSection((prevSection) => prevSection + 1);
  }
  };

  const handlePrev = () => {
    setCurrentSection((prevSection) => prevSection - 1);
  };

  async function handleSubmit() {
    const valid = validateForm(formData, currentSection, setErrors);
    setDialogOpen(!valid);
    if (valid) {
      const token = new JwtManager().getToken() || '';
      try {
        setIsLoading(true);
        const newStatus = await addWreck(formData, token);
        setStatus(newStatus);
        setIsStatusOpen(true);
        if (newStatus.success) {
          context?.useWrecks.mutate!();
          setFormData(initFormData());
          setCurrentSection(1);          
        }
      }
      finally {
        setIsLoading(false);
      }        
    }
  }

  const onCloseStatusDialog = () => {
    setIsStatusOpen(false);
    if (status?.success) {
      onSelect('map');
    }
  }
  
  const renderSection = (section: number) => {
    switch (section) {
      case 1:
        return <Section1 formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Section2 formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <Section3 formData={formData} setFormData={setFormData} errors={errors} />;
      case 4:
        return <Section4 formData={formData} setFormData={setFormData} errors={errors} />;
      case 5:
        return <Section5 formData={formData} setFormData={setFormData} errors={errors} />;
      default: {
        console.error('Unknown form section:', section);
        return <Section1 formData={formData} setFormData={setFormData} errors={errors} />;
      }
    }
  };
  
  return (
    <>
    {isLoading && <Loading centre={true}/> }
    <div className='bg-gray-100 md:p-4'>
      <div className='max-w-2xl mx-auto bg-white p-2 md:p-6 rounded border'>

        <h2>Section {currentSection} of {numSections}</h2>
        {renderSection(currentSection)}
      
        <div className='modal-action'>
          {currentSection > 1 && (
            <FormButton text='Previous' onClick={handlePrev} />
          )}
          {currentSection < numSections ? (
            <FormButton text='Next' onClick={handleNext} />

          ) : (
            <FormButton text='Submit' onClick={handleSubmit} />
          )}
        </div>
        {dialogOpen &&  <MessageBar
          message='Correct errors in this section before continuing'
          type='error'
          onClose={() => setDialogOpen(false)} />}
      </div>
    </div>

    {isStatusOpen && status && 
          <StatusMessage status={status} onClose={onCloseStatusDialog} />}

    </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------


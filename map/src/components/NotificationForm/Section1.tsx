import { LocationPicker } from '@components/LocationPicker';

import { getInputFileClass, getInputTextClass, IFormSectionProps } from './funcs';
import { FormLabelError } from './common';

// -----------------------------------------------------------------------------

export function Section1(props: IFormSectionProps): React.JSX.Element {
    const { errors, formData, setFormData } = props;
    
    return (
      <div className='mb-4'>
        <h2 className='font-bold text-lg'>Vessel Location</h2>
        <p className='label-text text-right'><b>*</b>  Required</p>

        <div className='form-control'>
          <label className='label'  htmlFor='sect1_latlon'>
              <span className='label-text font-bold'>Click on the map to show the location of the vessel <b>*</b></span>
              <FormLabelError text={errors.latitude} />
          </label>
          {<LocationPicker map_id='location_picker' 
            latitude={formData.latitude} longitude={formData.longitude}
              onChange={(lat: number, lon: number) => 
                setFormData({ ...formData, latitude: lat, longitude: lon})} />}
        </div>

        <div className='form-control'>
          <label className='label'  htmlFor='sect1_location'>
              <span className='label-text font-bold'>What is the name of this area? <b>*</b></span>
              <FormLabelError text={errors.location} />
          </label>
          <input type='text' id='sect1_location' 
                placeholder='Your answer' 
                className={getInputTextClass(errors.location)}
                defaultValue={formData.location}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormData({ ...formData, location: e.target.value})} />
        </div>

        <div className='form-control'>
          <label className='label'  htmlFor='sect1_photos'>
              <span className='label-text font-bold'>Please take a couple of photos and upload them here <b>*</b></span>
              <FormLabelError text={errors.photos} />
          </label>
          <input type='file' id='sect1_photos' 
                placeholder='Add files' 
                className={getInputFileClass(errors.photos)}
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormData({ ...formData, photos: e.target.files})} />
        </div>

      </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

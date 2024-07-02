import { devMode } from '@lib/config';
import { errLatLon } from '@lib/global';

// -----------------------------------------------------------------------------

export interface IFormData {
    // section 1 - location 
    location: string;
    photos: FileList | null;
    longitude: number;      
    latitude: number;       
    // section 2 - vessel details
    name: string;           // optional
    make: string;           // optional
    sort: string;
    length: string;
    hull: string;
    engine: string;
    // section 3 - hazards
    environmental: string[];
    safety: string[];
    // section 4 - salvage difficulty
    position: string;
    floating: string;
    vessel_condition: string;
    // section 5 - additional info
    additional: string;     // optional
}

export function initFormData(): IFormData {
    let data: IFormData = {
        location: '',
        latitude: errLatLon,
        longitude: errLatLon,
        photos: null,
        name: '',
        make: '',
        length: '',
        sort: '',
        hull: '',
        engine: '',
        environmental: [],
        safety: [],
        position: '',
        floating: '',
        vessel_condition: '',
        additional: ''
    };
    if (devMode) {
        data = {
            ...data,
            location: 'dev location',
            make: 'dev make',
            length: '22',
            sort: 'Canoe or small personal watercraft',
            hull: 'Wood',
            engine: 'Outboard engine',
            environmental: ['Fuel tanks', 'Containers of paint or chemicals'],
            position: 'Foreshore - above high water springs mark',
            floating: 'No',
            vessel_condition: 'Total wreck - will need to be dismantled in place',
        };
    }
    return data;
}
// -----------------------------------------------------------------------------
  
export type Errors = Partial<Record<keyof IFormData, string>>;

export interface IFormSectionProps {
    errors: Errors;
    formData: IFormData;
    setFormData: (formData: IFormData) => void;
 }
// -----------------------------------------------------------------------------
  
export const getInputFileClass = (text?: string): string => {
    const style = 'file-input file-input-bordered file-input-info file-input-sm w-full';
    return (text) ?  `${style} input-error` : style;
}
// -----------------------------------------------------------------------------
  
export const getInputTextAreaClass = (text?: string): string => {
    const style = 'textarea textarea-bordered';
    return (text) ?  `${style} input-error` : style;
}
// -----------------------------------------------------------------------------

export const getInputTextClass = (text?: string): string => {
    const style = 'input input-bordered w-full';
    return (text) ?  `${style} input-error` : style;
}

// -----------------------------------------------------------------------------
  
export function validateForm(formData: IFormData, section: number, 
      setErrors: React.Dispatch<React.SetStateAction<Errors>>): boolean {
    
    const errors: Errors= {};
    const required = '(required)';

    switch (section) {
        case 1: {
            if (!formData.location.trim()) {
                errors.location = required;
            }  
            if (formData.latitude === errLatLon || formData.latitude === errLatLon) {
                errors.latitude = required;
                errors.longitude = required;
            }  
            if (!formData.photos) {
                errors.photos = required;
            }  
            if (formData.photos) {
                const errs = new Set<string>();
                const fileArray = Array.from(formData.photos);
                if (fileArray.length > 2) {
                    errs.add('Maximum 2 photos allowed');
                }
                for (const file of fileArray) {
                    if (!/\.(jpg|jpeg)$/i.test(file.name)) {
                        errs.add('Invalid file format. Only JPG/JPEG files allowed');
                    }
                    if (file.size > 20000000) {
                        errs.add('File size must be less than 20MB');
                    }
                    if (errs.size > 0) {
                    errors.photos = [...errs].join('. ');
                    }
                }
            }
            break;
        }
        case 2: {
            if (!formData.length.trim()) {
                errors.length = required;
            }
            if (!formData.sort.trim()) {
                errors.sort = required;
            }
            if (!formData.hull.trim()) {
                errors.hull = required;
            }  
            if (!formData.engine.trim()) {
                errors.engine = required;
            }            
            break;
        }
        case 3: {
            break;
        }
        case 4: {
            if (!formData.position.trim()) {
                errors.position = required;
            }
            if (!formData.floating.trim()) {
                errors.floating = required;
            }
            if (!formData.vessel_condition.trim()) {
                errors.vessel_condition = required;
            }  
            break;
        }
        case 5: {
            break;
        }
        default: 
            console.error('Unknown section number: ', section);
    }
  
    setErrors(errors);
  
    return Object.keys(errors).length === 0;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

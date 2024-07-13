/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/api/icupApi';

import { type ChurchResponse } from '@/app/church/interfaces';
import { type PastorResponse, type PastorFormData, type PastorQueryParams } from '@/app/pastor/interfaces';

import { SearchTypePastor } from '@/app/pastor/enums';

//* Create pastor
export const createPastor = async (formData:PastorFormData ): Promise<PastorResponse> => {
  try {
    const {data} = await icupApi.post<PastorResponse>('/pastors', formData)
    
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw (error.response.data)
    }
    
    throw new Error('Ocurrió un error inesperado')
  }
}

//* Get all churches
export const getAllChurches = async (): Promise<ChurchResponse[]> => {
  try {
    const {data} = await icupApi<ChurchResponse[]>('/churches' , {
      params: {
        order: 'ASC'
      },
    }
    );
  
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw (error.response.data)
    }
    
    throw new Error('Ocurrió un error inesperado, hable con el administrador')
  }
}

//* Get all pastors (paginated)
export const getPastors = async ({limit, offset, all, order}: PastorQueryParams): Promise<PastorResponse[]> => {

 let result: PastorResponse[];

  try {
    if ( all !== undefined && !all) {
      const {data} = await icupApi<PastorResponse[]>('/pastors' , {
        params: {
          limit,
          offset,
          order,
        },
      });
      
      result = data;
    }else {
      const {data} = await icupApi<PastorResponse[]>('/pastors' , {
        params: {
          order,
        },
      });
      result = data;
    }

    return result;

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw (error.response.data)
    }
    
    throw new Error('Ocurrió un error inesperado, hable con el administrador')
  }
}

// ? Get pastors by term (paginated)
export const getPastorsByTerm = async ({ 
  searchType, 
  inputTerm, 
  dateTerm, 
  selectTerm, 
  namesTerm,
  lastNamesTerm,
  limit, 
  offset, 
  all, 
  order
}: PastorQueryParams): Promise<PastorResponse[] | undefined> => {

 let result: PastorResponse[];

 //* Origin country, department, province, district, urban sector, address
 if (searchType === SearchTypePastor.OriginCountry||
     searchType === SearchTypePastor.Department ||
     searchType === SearchTypePastor.Province ||
     searchType === SearchTypePastor.District ||
     searchType === SearchTypePastor.UrbanSector ||
     searchType === SearchTypePastor.Address
    ) {
    try {
        if ( all !== undefined && !all) {
            const {data} = await icupApi<PastorResponse[]>(`/pastors/${inputTerm}` , {
          params: {
            limit,
            offset,
            order,
            'search-type': searchType
          },
        });
        
        result = data;
      }else {
        const {data} = await icupApi<PastorResponse[]>(`/pastors/${inputTerm}` , {
          params: {
            order,
            'search-type': searchType
          },
        });
        result = data;
      }
    
      return result;
    
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw (error.response.data)
      }
      
      throw new Error('Ocurrió un error inesperado, hable con el administrador')
    }
 }

 //* Date Birth
  if (searchType === SearchTypePastor.BirthDate) {
    try {
      if ( all !== undefined && !all) {
        const {data} = await icupApi<PastorResponse[]>(`/pastors/${dateTerm}` , {
          params: {
            limit,
            offset,
            order,
            'search-type': searchType
          },
        });
        
        result = data;
      }else {
        const {data} = await icupApi<PastorResponse[]>(`/pastors/${dateTerm}` , {
          params: {
            order,
            'search-type': searchType
          },
        });
        result = data;
      }
    
      return result;
    
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw (error.response.data)
      }
      
      throw new Error('Ocurrió un error inesperado, hable con el administrador')
    }
  }

 //* Status, Gender, Month Birth
  if (searchType === SearchTypePastor.Status ||
        searchType === SearchTypePastor.Gender ||
        searchType === SearchTypePastor.BirthMonth ||
        searchType === SearchTypePastor.MaritalStatus
      ) {
      try {
        if ( all !== undefined && !all) {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${selectTerm}` , {
            params: {
              limit,
              offset,
              order,
              'search-type': searchType
            },
          });
          
          result = data;
        }else {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${selectTerm}` , {
            params: {
              order,
              'search-type': searchType
            },
          });
          result = data;
        }
      
        return result;
      
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw (error.response.data)
        }
        
        throw new Error('Ocurrió un error inesperado, hable con el administrador')
      }
  }

 //* First Name
  if (searchType === SearchTypePastor.FirstName
      ) {
      try {
        if ( all !== undefined && !all) {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${namesTerm}` , {
            params: {
              limit,
              offset,
              order,
              'search-type': searchType
            },
          });
          
          result = data;
        }else {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${namesTerm}` , {
            params: {
              order,
              'search-type': searchType
            },
          });

          result = data;
        }
      
        return result;
      
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw (error.response.data)
        }
        
        throw new Error('Ocurrió un error inesperado, hable con el administrador')
      }
  }

 //* Last Name 
  if (searchType === SearchTypePastor.LastName
      ) {
      try {
        if ( all !== undefined && !all) {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${lastNamesTerm}` , {
            params: {
              limit,
              offset,
              order,
              'search-type': searchType
            },
          });
          
          result = data;
        }else {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${lastNamesTerm}` , {
            params: {
              order,
              'search-type': searchType
            },
          });

          result = data;
        }
      
        return result;
      
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw (error.response.data)
        }
        
        throw new Error('Ocurrió un error inesperado, hable con el administrador')
      }
  }

 //* Full Name
  if (searchType === SearchTypePastor.FullName
      ) {
      try {
        if ( all !== undefined && !all) {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${namesTerm}-${lastNamesTerm}` , {
            params: {
              limit,
              offset,
              order,
              'search-type': searchType
            },
          });
          
          result = data;
        }else {
          const {data} = await icupApi<PastorResponse[]>(`/pastors/${namesTerm}-${lastNamesTerm}` , {
            params: {
              order,
              'search-type': searchType
            },
          });

          result = data;
        }
      
        return result;
      
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          throw (error.response.data)
        }
        
        throw new Error('Ocurrió un error inesperado, hable con el administrador')
      }
  }
}

// //* Update pastor by ID
export interface updatePastorOptions {
  id: string;
  formData: PastorFormData;
}

export const updatePastor = async ({id, formData}: updatePastorOptions ): Promise<PastorResponse> => {
  try {
    const {data} = await icupApi.patch<PastorResponse>(`/pastors/${id}`, formData)

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw (error.response.data)
    }
    
    throw new Error('Ocurrió un error inesperado')
  }
}

// //! Delete pastor by ID
export const deletePastor = async (id: string ): Promise<void> => {
  try {
    const {data} = await icupApi.delete(`/pastors/${id}`)

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw (error.response.data)
    }
    
    throw new Error('Ocurrió un error inesperado, hable con el administrador')
  }
}

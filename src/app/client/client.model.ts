export class Client {
  title: string;
  name: string;
  job_title: string;
  organization: string;
  email: string;
  category: string;
  subcategory?: string[];
  mobile?: string;
  phone?: string;
  fax?: string;
  core: boolean;
  id?: string;

  constructor(title: string, name: string, job_title: string, organization: string, email: string, category: string, core: boolean, subcategory?: string[], mobile?: string, phone?: string, fax?: string, id?: string) {
    this.title = title;
    this.name = name;
    this.job_title = job_title;
    this.organization = organization;
    this.email = email;
    this.category = category;
    this.subcategory = subcategory;
    this.mobile = mobile;
    this.phone = phone;
    this.fax =fax;
    this.core = core;
    this.id = id;
  }
}

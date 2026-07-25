import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import api, { getError } from '../services/api.js';

const budgets = ['<$500', '$500-$1000', '$1000-$5000', '>$5000'];
export function LeadForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  async function onSubmit(values) { try { const { data } = await api.post('/leads', values); toast.success(data.message); reset(); } catch (error) { toast.error(getError(error)); } }
  const input = (name, rules) => ({ ...register(name, rules), 'aria-invalid': Boolean(errors[name]) });
  return <form className="lead-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <div className="form-row"><label>Name<input placeholder="Your full name" {...input('name', { required: 'Your name is required.', minLength: { value: 2, message: 'Use at least 2 characters.' }, maxLength: 80 })} /></label><FieldError error={errors.name} />
    <label>Email<input type="email" placeholder="you@company.com" {...input('email', { required: 'Your email is required.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email.' } })} /></label><FieldError error={errors.email} /></div>
    <label>Estimated budget<select defaultValue="" {...input('budget', { required: 'Choose a budget range.' })}><option value="" disabled>Select a range</option>{budgets.map((budget) => <option key={budget}>{budget}</option>)}</select></label><FieldError error={errors.budget} />
    <label>Tell us about your project<textarea rows="4" placeholder="What are you hoping to build?" {...input('message', { required: 'A short project note is required.', minLength: { value: 10, message: 'Please add a little more detail.' }, maxLength: 1000 })} /></label><FieldError error={errors.message} />
    <button className="button primary full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : <>Start a conversation <Send size={17} /></>}</button>
  </form>;
}
function FieldError({ error }) { return error ? <small className="field-error">{error.message}</small> : null; }

export interface CandidateData {
  name: string;
  current_job_title: string;
  current_company: string;
  industry: string;
  fitting_score: number;
  years_experience: number;
  qualification: string;
  key_skills: string;
  linkedin_url: string;
  linkedin_snippet: string;
  photo_url?: string;
  [key: string]: string | number | undefined;
}

export class GoogleSheetsService {
  private static readonly SHEET_ID = '1_EEcJwL1AhfWXjdesahqi91zPKRvtsLDUOMbCOo-PhY';
  private static readonly GID = '1781793567';
  
  static async fetchCandidateData(): Promise<CandidateData[]> {
    try {
      // Try to fetch as CSV export first (works for public sheets)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv&gid=${this.GID}`;
      
      const response = await fetch(csvUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      return this.parseCsvData(csvText);
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      // Return mock data as fallback
      return this.getMockData();
    }
  }
  
  private static parseCsvData(csvText: string): CandidateData[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return this.getMockData();
    
    const headers = this.parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
    console.log('CSV Headers:', headers); // Debug log
    
    const data: CandidateData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Parse CSV line properly handling quoted fields
      const values = this.parseCSVLine(line);
      console.log('CSV Values:', values); // Debug log
      
      // Map to exact Google Sheet columns based on actual headers:
      // Name, Title, Current Company, Fitting Score, Experience, Qualification, Industry, LinkedIn URL, LinkedIn Snippet
      const nameIdx = headers.indexOf('name');
      const titleIdx = headers.indexOf('title');
      const companyIdx = headers.indexOf('current company');
      const scoreIdx = headers.indexOf('fitting score');
      const experienceIdx = headers.indexOf('experience');
      const qualificationIdx = headers.indexOf('qualifcation'); // Note: typo in sheet
      const industryIdx = headers.indexOf('industry');
      const linkedinIdx = headers.indexOf('linkedin url');
      const snippetIdx = headers.indexOf('linkedin snippet');
      
      const name = this.cleanText(values[nameIdx]) || '';
      const title = this.cleanText(values[titleIdx]) || '';
      const company = this.cleanText(values[companyIdx]) || '';
      const scoreText = this.cleanText(values[scoreIdx]) || '';
      const experienceText = this.cleanText(values[experienceIdx]) || '';
      const qualification = this.cleanText(values[qualificationIdx]) || '';
      const industry = this.cleanText(values[industryIdx]) || '';
      const linkedinUrl = this.cleanText(values[linkedinIdx]) || '';
      const snippet = this.cleanText(values[snippetIdx]) || '';
      
      // Skip if no name or score
      if (!name || !scoreText) continue;
      
      // Extract and normalize fitting score - round to integer
      let fittingScore = parseFloat(scoreText.replace('%', '')) || 0;
      fittingScore = Math.round(fittingScore);
      
      // Parse years of experience - round to integer
      let yearsExperience = 0;
      if (experienceText) {
        // Handle formats like "20 years", "Over a decade", "14+", "NA"
        if (experienceText.toLowerCase() === 'na') {
          yearsExperience = 0;
        } else if (experienceText.toLowerCase().includes('decade')) {
          yearsExperience = 10;
        } else {
          const expMatch = experienceText.match(/(\d+)/);
          yearsExperience = expMatch ? Math.round(parseInt(expMatch[1])) : 0;
        }
      }
      
      // Cap unreasonable experience at 70 years
      if (yearsExperience > 70) yearsExperience = 70;
      if (yearsExperience < 0) yearsExperience = 0;
      
      // Normalize qualification
      const normalizedQualification = this.normalizeQualification(qualification);
      
      // Extract key skills from snippet
      const keySkills = this.extractSkills(title, snippet);
      
      const candidate: CandidateData = {
        name,
        current_job_title: title,
        current_company: company || 'Not specified',
        industry: industry || 'Not specified',
        fitting_score: fittingScore, // Integer, no decimal
        years_experience: yearsExperience, // Integer, no decimal
        qualification: normalizedQualification,
        key_skills: keySkills,
        linkedin_url: linkedinUrl.startsWith('http') ? linkedinUrl : '',
        linkedin_snippet: snippet,
        photo_url: undefined, // No photo URLs in current sheet
      };
      
      data.push(candidate);
    }
    
    return data.filter(c => c.name && c.fitting_score > 0);
  }
  
  private static cleanText(text: string): string {
    if (!text) return '';
    return text.trim().replace(/^["']|["']$/g, '');
  }
  
  private static extractCompany(title: string, snippet: string): string {
    // Look for company patterns in title like "at CompanyName" or "CompanyName"
    const atCompanyMatch = title.match(/at\s+([^|,\-]+)/i);
    if (atCompanyMatch) return atCompanyMatch[1].trim();
    
    // Look for company patterns in snippet
    const companyPatterns = [
      /currently\s+at\s+([^,.]+)/i,
      /works?\s+at\s+([^,.]+)/i,
      /employed\s+at\s+([^,.]+)/i,
      /\bat\s+([A-Z][a-zA-Z\s&]+(?:Ltd|Inc|Corp|Limited|Company)?)/
    ];
    
    for (const pattern of companyPatterns) {
      const match = snippet.match(pattern);
      if (match) return match[1].trim();
    }
    
    return 'Private Company';
  }
  
  private static extractIndustry(title: string, snippet: string): string {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('finance') || text.includes('financial') || text.includes('bank')) return 'Finance';
    if (text.includes('technology') || text.includes('software') || text.includes('tech')) return 'Technology';
    if (text.includes('healthcare') || text.includes('medical') || text.includes('pharma')) return 'Healthcare';
    if (text.includes('marketing') || text.includes('advertising')) return 'Marketing';
    if (text.includes('consulting') || text.includes('consultant')) return 'Consulting';
    if (text.includes('manufacturing') || text.includes('industrial')) return 'Manufacturing';
    if (text.includes('retail') || text.includes('sales')) return 'Retail';
    if (text.includes('education') || text.includes('academic')) return 'Education';
    
    return 'Professional Services';
  }
  
  private static normalizeQualification(qualification: string): string {
    if (!qualification) return 'Below Degree';
    
    const qual = qualification.toLowerCase().trim();
    
    if (qual.includes('doctor') || qual.includes('phd') || qual.includes('ph.d') || qual.includes('doctorate')) {
      return 'Doctor';
    }
    if (qual.includes('master') || qual.includes('mba') || qual.includes('msc') || qual.includes('ma ')) {
      return 'Master';
    }
    if (qual.includes('degree') || qual.includes('bachelor') || qual.includes('university') || qual.includes('college')) {
      return 'Degree';
    }
    
    return 'Below Degree';
  }
  
  private static extractSkills(title: string, snippet: string): string {
    const text = title + ' ' + snippet;
    const skillKeywords = [
      'Financial Analysis', 'Excel', 'Financial Modeling', 'Risk Management', 'Accounting',
      'Investment', 'Portfolio Management', 'Strategic Planning', 'Leadership', 'Management',
      'Analytics', 'Reporting', 'Budgeting', 'Forecasting', 'Compliance', 'Audit',
      'Strategy', 'Operations', 'Business Development', 'Project Management'
    ];
    
    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills.length > 0 ? foundSkills.join(', ') : 'Professional Skills';
  }
  
  private static parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(field => field.trim());
  }
  
  private static getMockData(): CandidateData[] {
    // Fallback mock data matching new interface
    const titles = ['Finance Director', 'Senior Financial Analyst', 'Investment Manager', 'Risk Manager', 'Portfolio Manager'];
    const companies = ['Goldman Sachs', 'JP Morgan', 'HSBC', 'Standard Chartered', 'Citibank'];
    const industries = ['Investment Banking', 'Commercial Banking', 'Asset Management', 'Risk Management', 'Corporate Finance'];
    const qualifications = ['Doctor', 'Master', 'Degree', 'Below Degree'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      name: `Professional ${i + 1}`,
      current_job_title: titles[Math.floor(Math.random() * titles.length)],
      current_company: companies[Math.floor(Math.random() * companies.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      fitting_score: Math.round((Math.random() * 40 + 60) * 10) / 10, // 60-100 with 1 decimal
      years_experience: Math.floor(Math.random() * 20) + 1,
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      key_skills: 'Financial Analysis, Risk Management, Strategic Planning',
      linkedin_url: `https://linkedin.com/in/professional-${i + 1}`,
      linkedin_snippet: `Experienced finance professional with strong analytical skills and leadership experience.`,
    }));
  }
}
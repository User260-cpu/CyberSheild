function checkPasswordStrength(password) {
    const criteria = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  
    const strength = Object.values(criteria).filter(Boolean).length;
  
    let message = "";
    let color = "";
  
    switch (strength) {
      case 5:
        message = "Strong";
        color = "green";
        break;
      case 4:
        message = "Good";
        color = "blue";
        break;
      case 3:
        message = "Fair";
        color = "orange";
        break;
      default:
        message = "Weak";
        color = "red";
    }
  
    return { message, color };
  }
  
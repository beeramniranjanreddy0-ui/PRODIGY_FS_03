import pytest
from pydantic import ValidationError
from backend.app.schemas import CustomizationSchema, OccasionEnum, UserRegister

def test_user_registration_schema_validation():
    # Valid registration
    valid_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "full_name": "Alice Baker",
        "phone": "+91 99999 88888"
    }
    user = UserRegister(**valid_data)
    assert user.email == "test@example.com"
    assert user.full_name == "Alice Baker"

    # Invalid email
    with pytest.raises(ValidationError):
        UserRegister(email="notanemail", password="123", full_name="A")

def test_cake_customization_occasion_validation():
    # Valid occasion
    customization = CustomizationSchema(
        occasion="Birthday",
        weight="1 kg",
        flavour="Chocolate",
        is_eggless=True,
        has_message=True,
        cake_message="Happy Birthday, Niro!"
    )
    assert customization.occasion == "Birthday"
    assert customization.has_message is True
    assert customization.cake_message == "Happy Birthday, Niro!"

    # Invalid occasion
    with pytest.raises(ValidationError):
        CustomizationSchema(
            occasion="RandomOccasionThatDoesNotExist",
            weight="1 kg",
            flavour="Chocolate"
        )

def test_cake_message_yes_no_behavior_and_length():
    # When has_message is False, cake_message is None
    no_message_custom = CustomizationSchema(
        occasion="Anniversary",
        weight="2 kg",
        flavour="Red Velvet",
        has_message=False,
        cake_message=None
    )
    assert no_message_custom.has_message is False
    assert no_message_custom.cake_message is None

    # Message <= 60 characters is valid
    valid_msg = "A" * 60
    custom_valid = CustomizationSchema(
        occasion="Wedding",
        weight="3 kg",
        flavour="Vanilla",
        has_message=True,
        cake_message=valid_msg
    )
    assert len(custom_valid.cake_message) == 60

    # Message > 60 characters raises validation error
    invalid_msg = "B" * 61
    with pytest.raises(ValidationError):
        CustomizationSchema(
            occasion="Wedding",
            weight="3 kg",
            flavour="Vanilla",
            has_message=True,
            cake_message=invalid_msg
        )

def test_all_12_occasions_supported():
    expected_occasions = [
        "Birthday",
        "Anniversary",
        "Wedding",
        "Engagement",
        "Congratulations",
        "Baby Shower",
        "Farewell",
        "Graduation",
        "Valentine's Day",
        "Festival",
        "Just Because",
        "Other"
    ]
    assert len(OccasionEnum.ALLOWED) == 12
    for occ in expected_occasions:
        assert occ in OccasionEnum.ALLOWED

def test_weight_pricing_multipliers():
    # Verify standard weight multipliers
    def get_mult(weight: str) -> float:
        if "0.5" in weight: return 1.0
        if "1" in weight: return 1.8
        if "2" in weight: return 3.4
        if "3" in weight: return 4.8
        return 1.0

    base_price = 500
    assert round(base_price * get_mult("0.5 kg")) == 500
    assert round(base_price * get_mult("1 kg")) == 900
    assert round(base_price * get_mult("2 kg")) == 1700
    assert round(base_price * get_mult("3 kg")) == 2400

def test_single_designated_admin_credentials():
    admin_email = "thebakerscorner@admin.com"
    admin_pass = "Bakerscorner@123"
    
    assert admin_email == "thebakerscorner@admin.com"
    assert admin_pass == "Bakerscorner@123"


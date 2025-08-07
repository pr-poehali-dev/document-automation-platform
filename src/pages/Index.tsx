import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface User {
  name: string;
  position: string;
  department: string;
  service: string;
}

interface Participant {
  id: string;
  name: string;
  position: string;
  department: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'protocol' | 'documents' | 'order-templates' | 'order-editor'>('login');
  const [loginData, setLoginData] = useState({ login: '', password: '', service: '' });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [protocolData, setProtocolData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    agenda: '',
    decisions: '',
    tasks: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [orderContent, setOrderContent] = useState<string>('');
  const [fields, setFields] = useState<Array<{id: string, type: string, value: string, position: {x: number, y: number}, width: number, height: number}>>([]);
  const [suggestions, setSuggestions] = useState<Array<{type: string, text: string, position: number}>>([]);

  const services = [
    { id: 'management', name: 'Служба управления делами', canEditTemplates: true },
    { id: 'economics', name: 'Служба экономики и финансов', canEditTemplates: false },
    { id: 'hr', name: 'Служба управления персоналом', canEditTemplates: false }
  ];

  const documentTypes = [
    { id: 'protocol', name: 'Протокол совещания', icon: 'FileText' },
    { id: 'order', name: 'Приказ', icon: 'FileSignature' },
    { id: 'letter', name: 'Письмо', icon: 'Mail' },
    { id: 'telegram', name: 'Телеграмма', icon: 'Send' },
    { id: 'template', name: 'Новый шаблон', icon: 'Plus' }
  ];

  const standardPhrases = [
    'Заслушаны доклады:',
    'Приказываю:',
    'Решено:',
    'Организовать:',
    'Обеспечить контроль:',
    'Установить срок:'
  ];

  const mockParticipants = [
    { id: '1', name: 'Иванов Иван Иванович', position: 'Директор', department: 'Администрация' },
    { id: '2', name: 'Петрова Анна Сергеевна', position: 'Зам. директора', department: 'Экономический отдел' },
    { id: '3', name: 'Сидоров Петр Николаевич', position: 'Начальник отдела', department: 'Кадры' }
  ];

  const orderTemplates = [
    { id: '1', name: 'О командировке', preview: 'Приказ о направлении в командировку...', fields: 3 },
    { id: '2', name: 'О премировании', preview: 'Приказ о премировании сотрудников...', fields: 5 },
    { id: '3', name: 'О назначении', preview: 'Приказ о назначении на должность...', fields: 4 },
    { id: '4', name: 'О дисциплинарном взыскании', preview: 'Приказ о применении дисциплинарного...', fields: 6 },
    { id: '5', name: 'Об отпуске', preview: 'Приказ о предоставлении отпуска...', fields: 3 },
    { id: '6', name: 'О переводе', preview: 'Приказ о переводе на другую должность...', fields: 4 }
  ];

  const fieldTypes = [
    { id: 'text', name: 'Текстовое поле', icon: 'Type' },
    { id: 'date', name: 'Дата', icon: 'Calendar' },
    { id: 'employee', name: 'Сотрудник', icon: 'User' },
    { id: 'department', name: 'Подразделение', icon: 'Building' },
    { id: 'position', name: 'Должность', icon: 'Briefcase' },
    { id: 'amount', name: 'Сумма', icon: 'DollarSign' },
    { id: 'signature', name: 'Подпись', icon: 'FileSignature' }
  ];

  const handleLogin = () => {
    if (loginData.login && loginData.password && loginData.service) {
      const service = services.find(s => s.id === loginData.service);
      setCurrentUser({
        name: 'Иванов И.И.',
        position: 'Специалист',
        department: service?.name || '',
        service: loginData.service
      });
      setCurrentView('dashboard');
    }
  };

  const handleDocumentTypeSelect = (type: string) => {
    if (type === 'protocol') {
      setCurrentView('protocol');
    } else if (type === 'order') {
      setCurrentView('order-templates');
    } else {
      setCurrentView('documents');
    }
  };

  const addParticipant = (participant: Participant) => {
    if (!participants.find(p => p.id === participant.id)) {
      setParticipants([...participants, participant]);
    }
  };

  const generateQRCode = () => {
    // Симуляция QR-кода для быстрого добавления участников
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=meeting-${Date.now()}`;
  };

  const checkTextQuality = (text: string) => {
    const suggestions = [];
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      // Проверка предлогов и союзов в конце строки
      const prepositions = ['в', 'на', 'с', 'по', 'от', 'до', 'для', 'при', 'без', 'через'];
      const conjunctions = ['и', 'а', 'но', 'или', 'либо', 'то', 'не'];
      const words = line.trim().split(' ');
      const lastWord = words[words.length - 1]?.toLowerCase().replace(/[.,!?]/g, '');
      
      if (prepositions.includes(lastWord) || conjunctions.includes(lastWord)) {
        suggestions.push({
          type: 'line-break',
          text: `Рекомендуется перенести слово "${lastWord}" на следующую строку`,
          position: index
        });
      }
      
      // Проверка названий должностей
      const positions = ['директор', 'заместитель', 'начальник', 'специалист', 'инженер'];
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
        if (positions.includes(cleanWord) && word !== word.charAt(0).toUpperCase() + word.slice(1)) {
          suggestions.push({
            type: 'capitalization',
            text: `"${word}" должно быть с заглавной буквы`,
            position: index
          });
        }
      });
    });
    
    setSuggestions(suggestions);
  };

  const addField = (type: string) => {
    const newField = {
      id: Date.now().toString(),
      type,
      value: '',
      position: { x: 100, y: 100 },
      width: 200,
      height: 30
    };
    setFields([...fields, newField]);
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={32} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Электронный документооборот
            </CardTitle>
            <p className="text-slate-600 mt-2">Авторизация в системе</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                value={loginData.login}
                onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                placeholder="Введите логин"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Введите пароль"
              />
            </div>
            <div>
              <Label htmlFor="service">Служба</Label>
              <Select onValueChange={(value) => setLoginData({ ...loginData, service: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите службу" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    const currentService = services.find(s => s.id === currentUser?.service);
    
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Электронный документооборот</h1>
                <p className="text-sm text-slate-600">{currentService?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-slate-600">
                {currentUser?.name}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('login');
                }}
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Создание документов</h2>
            <p className="text-slate-600">Выберите тип документа для создания</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documentTypes.map((type) => (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                onClick={() => handleDocumentTypeSelect(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name={type.icon as any} size={24} className="text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{type.name}</h3>
                  <Button variant="outline" className="w-full">
                    Создать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentService?.canEditTemplates && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings" size={20} />
                  Управление шаблонами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Как представитель службы управления делами, вы можете редактировать шапки документов для всех шаблонов.
                </p>
                <Button variant="outline">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать шаблоны
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  if (currentView === 'order-templates') {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
                <Icon name="ArrowLeft" size={16} />
              </Button>
              <h1 className="text-xl font-semibold text-slate-800">Выбор шаблона приказа</h1>
            </div>
            <Button variant="outline">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать шаблон
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Шаблоны приказов</h2>
            <p className="text-slate-600">Выберите подходящий шаблон для создания приказа</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderTemplates.map((template) => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 group"
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setCurrentView('order-editor');
                }}
              >
                <CardContent className="p-0">
                  {/* Превью документа А4 */}
                  <div className="aspect-[210/297] bg-white border rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 p-4 text-xs leading-tight">
                      {/* Шапка документа */}
                      <div className="text-center mb-4 border-b pb-2">
                        <div className="font-semibold">МИНИСТЕРСТВО ОБРАЗОВАНИЯ</div>
                        <div className="text-slate-600">И НАУКИ РОССИЙСКОЙ ФЕДЕРАЦИИ</div>
                      </div>
                      
                      {/* Заголовок приказа */}
                      <div className="text-center mb-3">
                        <div className="font-semibold">ПРИКАЗ</div>
                        <div className="text-slate-600">№ _____ от "___" _______ 2024 г.</div>
                      </div>
                      
                      {/* Название приказа */}
                      <div className="text-center mb-4 font-semibold">
                        {template.name.toUpperCase()}
                      </div>
                      
                      {/* Поля для заполнения - подсвечиваются */}
                      <div className="space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-blue-800">
                          [Основание приказа]
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-green-800">
                          [Ф.И.О. сотрудника]
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-yellow-800">
                          [Должность, подразделение]
                        </div>
                        {template.fields > 3 && (
                          <div className="bg-purple-50 border border-purple-200 rounded px-2 py-1 text-purple-800">
                            [Дополнительные условия]
                          </div>
                        )}
                      </div>
                      
                      {/* Подпись */}
                      <div className="absolute bottom-4 right-4">
                        <div className="text-right text-xs">
                          <div>Директор _______________</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Индикатор полей */}
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs border shadow-sm">
                      {template.fields} полей
                    </div>
                  </div>
                  
                  {/* Название шаблона */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{template.preview}</p>
                    <Button className="w-full" variant="outline">
                      Использовать шаблон
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'order-editor') {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('order-templates')}>
                <Icon name="ArrowLeft" size={16} />
              </Button>
              <h1 className="text-xl font-semibold text-slate-800">Редактор приказа</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={suggestions.length > 0 ? 'destructive' : 'default'} className="mr-2">
                {suggestions.length} предложений
              </Badge>
              <Button variant="outline" size="sm">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button size="sm">
                <Icon name="FileDown" size={16} className="mr-2" />
                Экспорт PDF
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-screen">
          {/* Основная область редактирования */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Лист А4 */}
              <div className="bg-white shadow-lg" style={{ width: '794px', minHeight: '1123px', margin: '0 auto', padding: '96px 72px' }}>
                {/* Шапка документа */}
                <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
                  <div className="text-lg font-bold">МИНИСТЕРСТВО ОБРАЗОВАНИЯ</div>
                  <div className="text-lg font-bold">И НАУКИ РОССИЙСКОЙ ФЕДЕРАЦИИ</div>
                  <div className="text-base mt-2">Федеральное государственное бюджетное учреждение</div>
                  <div className="text-base">"Научно-исследовательский институт"</div>
                </div>

                {/* Заголовок приказа */}
                <div className="text-center mb-8">
                  <div className="text-xl font-bold mb-2">ПРИКАЗ</div>
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-50 border-2 border-blue-300 rounded px-3 py-1 cursor-pointer hover:bg-blue-100 transition-colors">
                      № _______
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-300 rounded px-3 py-1 cursor-pointer hover:bg-blue-100 transition-colors">
                      от "___" _______ 2024 г.
                    </div>
                  </div>
                </div>

                {/* Название приказа */}
                <div className="text-center mb-8">
                  <div className="bg-green-50 border-2 border-green-300 rounded px-4 py-2 cursor-pointer hover:bg-green-100 transition-colors inline-block">
                    <span className="font-bold">О КОМАНДИРОВКЕ</span>
                  </div>
                </div>

                {/* Содержание приказа */}
                <div className="space-y-4 mb-8">
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded p-4 cursor-pointer hover:bg-yellow-100 transition-colors">
                    <span className="text-slate-600">Основание:</span> В связи с производственной необходимостью и для выполнения служебного задания
                  </div>
                  
                  <div className="font-bold text-center mb-4">ПРИКАЗЫВАЮ:</div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <div className="flex-1">
                        Направить в командировку 
                        <span className="bg-purple-50 border-2 border-purple-300 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-purple-100 transition-colors inline-block">
                          [Ф.И.О. сотрудника]
                        </span>
                        , 
                        <span className="bg-orange-50 border-2 border-orange-300 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-orange-100 transition-colors inline-block">
                          [должность]
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <div className="flex-1">
                        Место командировки: 
                        <span className="bg-red-50 border-2 border-red-300 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-red-100 transition-colors inline-block">
                          [город, организация]
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <div className="flex-1">
                        Срок командировки: с 
                        <span className="bg-indigo-50 border-2 border-indigo-300 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-indigo-100 transition-colors inline-block">
                          [дата начала]
                        </span>
                        по 
                        <span className="bg-indigo-50 border-2 border-indigo-300 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-indigo-100 transition-colors inline-block">
                          [дата окончания]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Подпись */}
                <div className="flex justify-between items-end mt-16">
                  <div>
                    <div className="mb-2">Исполнитель:</div>
                    <div className="bg-teal-50 border-2 border-teal-300 rounded px-3 py-1 cursor-pointer hover:bg-teal-100 transition-colors inline-block">
                      [Ф.И.О., телефон]
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">Директор</div>
                    <div className="border-b-2 border-slate-800 w-48 mb-2"></div>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors">
                      [Ф.И.О. директора]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Панель управления полями */}
          <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Типы полей */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Добавить поля</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fieldTypes.map((fieldType) => (
                    <Button
                      key={fieldType.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addField(fieldType.id)}
                    >
                      <Icon name={fieldType.icon as any} size={16} className="mr-2" />
                      {fieldType.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Проверка качества */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="CheckCircle" size={20} />
                    Проверка качества
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.length === 0 ? (
                    <div className="text-green-600 flex items-center gap-2">
                      <Icon name="Check" size={16} />
                      Ошибок не найдено
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <div className="font-medium text-yellow-800">{suggestion.type === 'line-break' ? 'Перенос строки' : 'Заглавная буква'}</div>
                          <div className="text-yellow-700">{suggestion.text}</div>
                        </div>
                      ))}
                      {suggestions.length > 3 && (
                        <div className="text-sm text-slate-500">+{suggestions.length - 3} ещё</div>
                      )}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => checkTextQuality(orderContent)}
                  >
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Проверить снова
                  </Button>
                </CardContent>
              </Card>

              {/* Стандарты оформления */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Стандарты</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Icon name="Check" size={14} />
                    <span>Шрифт: Times New Roman 14pt</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Icon name="Check" size={14} />
                    <span>Межстрочный интервал: 1.5</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Icon name="Check" size={14} />
                    <span>Поля: 2 см со всех сторон</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Icon name="AlertTriangle" size={14} />
                    <span>Абзацный отступ: требует проверки</span>
                  </div>
                </CardContent>
              </Card>

              {/* История полей */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Часто используемые</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                      "В связи с производственной необходимостью"
                    </div>
                    <div className="p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                      "Для выполнения служебного задания"
                    </div>
                    <div className="p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                      "В целях оптимизации работы"
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'protocol') {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
                <Icon name="ArrowLeft" size={16} />
              </Button>
              <h1 className="text-xl font-semibold text-slate-800">Создание протокола совещания</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить черновик
              </Button>
              <Button size="sm">
                <Icon name="FileDown" size={16} className="mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название совещания</Label>
                    <Input
                      id="title"
                      value={protocolData.title}
                      onChange={(e) => setProtocolData({ ...protocolData, title: e.target.value })}
                      placeholder="Еженедельное совещание руководителей"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Дата</Label>
                      <Input
                        id="date"
                        type="date"
                        value={protocolData.date}
                        onChange={(e) => setProtocolData({ ...protocolData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Время</Label>
                      <Input
                        id="time"
                        type="time"
                        value={protocolData.time}
                        onChange={(e) => setProtocolData({ ...protocolData, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Место проведения</Label>
                    <Input
                      id="location"
                      value={protocolData.location}
                      onChange={(e) => setProtocolData({ ...protocolData, location: e.target.value })}
                      placeholder="Конференц-зал, 3 этаж"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Содержание протокола</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="agenda" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="agenda">Повестка</TabsTrigger>
                      <TabsTrigger value="decisions">Решения</TabsTrigger>
                      <TabsTrigger value="tasks">Поручения</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agenda">
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Select onValueChange={(value) => setProtocolData({ ...protocolData, agenda: protocolData.agenda + value + '\n' })}>
                            <SelectTrigger className="w-auto">
                              <SelectValue placeholder="Стандартные фразы" />
                            </SelectTrigger>
                            <SelectContent>
                              {standardPhrases.map((phrase) => (
                                <SelectItem key={phrase} value={phrase}>
                                  {phrase}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={protocolData.agenda}
                          onChange={(e) => setProtocolData({ ...protocolData, agenda: e.target.value })}
                          placeholder="Введите повестку совещания..."
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="decisions">
                      <Textarea
                        value={protocolData.decisions}
                        onChange={(e) => setProtocolData({ ...protocolData, decisions: e.target.value })}
                        placeholder="Принятые решения..."
                        className="min-h-[200px]"
                      />
                    </TabsContent>
                    <TabsContent value="tasks">
                      <Textarea
                        value={protocolData.tasks}
                        onChange={(e) => setProtocolData({ ...protocolData, tasks: e.target.value })}
                        placeholder="Поручения и задачи..."
                        className="min-h-[200px]"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Users" size={20} />
                    Участники ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-lg">
                    <img 
                      src={generateQRCode()} 
                      alt="QR код для добавления участников" 
                      className="w-32 h-32 mx-auto mb-2"
                    />
                    <p className="text-sm text-slate-600">
                      Отсканируйте QR-код для быстрого добавления
                    </p>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Добавить вручную
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Выбор участников</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {mockParticipants.map((participant) => (
                          <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-sm text-slate-600">{participant.position}, {participant.department}</p>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => addParticipant(participant)}
                              disabled={participants.some(p => p.id === participant.id)}
                            >
                              {participants.some(p => p.id === participant.id) ? 'Добавлен' : 'Добавить'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-slate-600">{participant.position}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setParticipants(participants.filter(p => p.id !== participant.id))}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileSignature" size={20} />
                    Электронная подпись
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Shield" size={16} className="text-green-600" />
                    <span className="text-green-600">Сертификат действителен</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Документ будет подписан цифровой подписью при экспорте
                  </p>
                  <Button variant="outline" className="w-full">
                    <Icon name="Key" size={16} className="mr-2" />
                    Управление сертификатами
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>История протоколов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Протокол #47</span>
                      <span className="text-slate-500">05.12.2024</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Протокол #46</span>
                      <span className="text-slate-500">28.11.2024</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Показать все
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
            <Icon name="ArrowLeft" size={16} />
          </Button>
          <h1 className="text-xl font-semibold text-slate-800">Работа с документами</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <Icon name="FileText" size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-600 mb-2">Функционал в разработке</h2>
          <p className="text-slate-500">Модули писем и телеграмм будут добавлены в следующих версиях</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
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
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'protocol' | 'documents'>('login');
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

  const services = [
    { id: 'management', name: 'Служба управления делами', canEditTemplates: true },
    { id: 'economics', name: 'Служба экономики и финансов', canEditTemplates: false },
    { id: 'hr', name: 'Служба управления персоналом', canEditTemplates: false }
  ];

  const documentTypes = [
    { id: 'protocol', name: 'Протокол совещания', icon: 'FileText' },
    { id: 'order', name: 'Приказ', icon: 'Stamp' },
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
          <p className="text-slate-500">Модули приказов, писем и телеграмм будут добавлены в следующих версиях</p>
        </div>
      </main>
    </div>
  );
};

export default Index;